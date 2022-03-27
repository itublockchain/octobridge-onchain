// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./OctoToken20.sol";
import "./interfaces/IERC20B.sol";
import "./interfaces/ILZ.sol";

contract Octo20 {
    uint16 immutable chainID;
    uint256 private txNonces;
    LayerZero private lZero;
    mapping(address => Token) public tokens;
    mapping(bytes32 => address) public initialized;
    mapping(bytes32 => bool) private hashes;

    struct Token {
        uint16 originChain;
        address originAddress;
        uint256 lockedBalance;
    }

    constructor(uint16 _chainID, address _lz) {
        chainID = _chainID;
        lZero = LayerZero(_lz);
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
        Tx memory userTx = lZero.txs(msg.sender);
        require(userTx.amount == 0, "[claim] Tx doesn't exist");

        // Evaluate transaction
        uint16 txOriginChainId; 
        unchecked { txOriginChainId = uint16(userTx.IDs / 2 ** 32); }

        address txOriginAddress = userTx.originAddress;
        uint256 txAmount = userTx.amount;

        uint16 tmpChainId;
        unchecked { tmpChainId = uint16(userTx.IDs % 2**16); }
        uint chid;
        unchecked{chid = userTx.IDs / 2 ** 32;}

        require(!hashes[keccak256(abi.encodePacked(chid, userTx.nonce))], "[claim] Tx already submitted.");

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
            }
            // Otherwise create a new token
            else {
                string memory name = userTx.name;
                string memory symbol = userTx.symbol;
                if(txOriginChainId == userTx.IDs % 2 ** 32) {
                    name = string.concat(name, " Octo");
                    symbol = string.concat(symbol, ".o");
                }
                OctoToken20 newToken = new OctoToken20(name, symbol);
                newToken.mint(msg.sender, txAmount);
                
                // Save token
                initialized[keccak256(abi.encodePacked(txOriginChainId, txOriginAddress))] = address(newToken);

                Token storage tokenInfo = tokens[address(newToken)];
                tokenInfo.originChain = txOriginChainId;
                tokenInfo.originAddress = txOriginAddress;
            }
        }

        hashes[keccak256(abi.encodePacked(chid, userTx.nonce))] = true;
    }
    
    function isOrigin(address _tokenAddress) public view returns (bool) {
        Token memory _token = tokens[_tokenAddress];
        return (_token.originChain == chainID);
    }
}