// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./OctoToken20.sol";
import "./interfaces/IERC20B.sol";
import "./LayerZero.sol";

contract Octo20 {
    uint16 immutable chainID;
    uint256 private txNonces;
    TxRelayer private lZero;
    mapping(address => Token) public tokens;
    mapping(bytes32 => address) public initialized;
    mapping(bytes32 => bool) private hashes;

    event log_1(uint256);
    event log_2(uint256, uint256);
    event log_3(uint256, uint256, uint256);
    event log_4(uint256, uint256, uint256, uint256);

    struct Token {
        uint16 originChain;
        address originAddress;
        uint256 lockedBalance;
    }

    constructor(uint16 _chainID, address payable _lz) {
        chainID = _chainID;
        lZero = TxRelayer(_lz);
    }

    fallback() external payable {}
    receive() external payable {}

    function lock(
        uint16 _originChain,
        uint16 _destination,
        uint16 _dstChainId,
        address _tokenAddress,
        uint256 _amount,
        bytes calldata _dstAddress
    ) external payable {
        require(_amount > 0, "[lock] Lock amount needs to be bigger than 0."); 
        IERC20B token = IERC20B(_tokenAddress);
        Token storage TokenInfo = tokens[_tokenAddress];

        if(TokenInfo.originAddress == address(0)){
            TokenInfo.originChain = chainID;
            TokenInfo.originAddress = _tokenAddress;
        } 

        if (isOrigin(_tokenAddress)) {
            TokenInfo.lockedBalance += _amount;
            require(token.transferFrom(msg.sender, address(this), _amount), "[lock] Unsuccessful token transfer.");
        } else {
            token.burnFrom(msg.sender, _amount);
        }

        uint256 sum;
        unchecked {
            sum += chainID * 2**32;
            sum += _destination *2**16;
            sum += _originChain;
        }

        lZero.sendTxInfo{value: msg.value}(
            _dstChainId,
            _dstAddress,
            msg.sender,
            sum,
            txNonces,
            _amount,
            TokenInfo.originAddress,
            token.name(),
            token.symbol()
        );

        txNonces++;
    }



    function claim() external {
        // Check for tx
        (
            address txUser, 
            address txOriginAddress, 
            uint256 txIds, 
            uint256 txNonce,
            uint256 txAmount,
            string memory txName,    
            string memory txSymbol    
        ) = lZero.txs(msg.sender);

        require(txUser == msg.sender, "[claim] invalid caller");
        require(txAmount != 0, "[claim] Tx doesn't exist");

        // Evaluate transaction
        uint16 txOriginChainId; 
        unchecked { txOriginChainId = uint16(txIds / 2 ** 32); }

        uint16 tmpChainId;
        unchecked { tmpChainId = uint16(txIds % 2**16); }
        
        uint256 chid;
        unchecked{chid = txIds / 2 ** 32;}

        require(!hashes[keccak256(abi.encodePacked(chid, txNonce))], "[claim] Tx already submitted.");

        if(chainID == tmpChainId) {
            Token storage tokenInfo = tokens[txOriginAddress];
            IERC20B token = IERC20B(txOriginAddress);
            require(tokenInfo.lockedBalance >= txAmount, "[claim] Token not available");

            // Deduct the amount
            tokenInfo.lockedBalance -= txAmount;
            require(token.transfer(msg.sender, txAmount), "[claim] Unsuccessful token transfer");
        }
        else {
            // Try to retrieve token address
            address tokenAddress = initialized[keccak256(abi.encodePacked(txOriginChainId, txOriginAddress))];
            if(tokenAddress != address(0)) {
                IERC20B token = IERC20B(tokenAddress);
                token.mint(msg.sender, txAmount);

                emit log_3(1,2,1);
            }
            // Otherwise create a new token
            else {
                // string memory name = txName;
                // string memory symbol = txSymbol;
                // if(txOriginChainId == txIds % 2 ** 32) {
                //     name = string.concat(name, " Octo");
                //     symbol = string.concat(symbol, ".o");
                // }
                OctoToken20 newToken = new OctoToken20(txName, txSymbol);
                newToken.mint(msg.sender, txAmount);
                
                // Save token
                initialized[keccak256(abi.encodePacked(txOriginChainId, txOriginAddress))] = address(newToken);

                Token storage tokenInfo = tokens[address(newToken)];
                tokenInfo.originChain = txOriginChainId;
                tokenInfo.originAddress = txOriginAddress;
            }
        }

        hashes[keccak256(abi.encodePacked(chid, txNonce))] = true;
        lZero.resetTxInfo(msg.sender);
    }
    
    function isOrigin(address _tokenAddress) public view returns (bool) {
        Token memory _token = tokens[_tokenAddress];
        return (_token.originChain == chainID);
    }
}