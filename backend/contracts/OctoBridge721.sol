// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./OctoToken721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "./interfaces/IERC721B.sol";
import "./interfaces/ILZ.sol";

contract Octo721 is ERC721Holder {
    uint16 immutable chainID;
    uint256 private txNonces;
    LayerZero private lZero;
    mapping(address => Token) public tokens;
    mapping(uint256 => address) public nftOwners;
    mapping(bytes32 => address) public initialized;
    mapping(bytes32 => bool) private hashes;

    struct Token {
        uint16 originChain;
        address originAddress;
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
        uint256 _id
    ) external payable {
        IERC721B nft = IERC721B(_tokenAddress);
        Token storage TokenInfo = tokens[_tokenAddress];

        if(TokenInfo.originAddress == address(0)){
            TokenInfo.originChain = chainID;
            TokenInfo.originAddress = _tokenAddress;
        }
        if (isOrigin(_tokenAddress)) {
            nftOwners[_id] = msg.sender;
            nft.safeTransferFrom(msg.sender, address(this), _id);
        } else {
            nft.burn(_id);
        }

        uint256 sum;
        unchecked {
            sum += chainID * 2**32;
            sum += _destination * 2**16;
            sum += _originChain;
        }

        lZero.sendTxInfo{value: msg.value}(
            _dstChainId,
            abi.encodePacked(address(lZero)),
            msg.sender,
            sum,
            txNonces,
            _id,
            TokenInfo.originAddress,
            nft.name(),
            nft.symbol()
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
        uint256 txId = userTx.amount;

        uint16 tmpChainId;
        unchecked { tmpChainId = uint16(userTx.IDs % 2**16); }
        uint chid;
        unchecked{chid = userTx.IDs / 2 ** 32;}

        require(!hashes[keccak256(abi.encodePacked(chid, userTx.nonce))], "[claim] Tx already submitted.");

        if(chainID == uint16(userTx.IDs % 10**16)) {
            IERC721B nft = IERC721B(txOriginAddress);
            require(nftOwners[txId] != address(0), "[claim] Token not available.");
            delete(nftOwners[txId]);
            nft.safeTransferFrom(address(this), msg.sender, txId);
        } else {
            // Try to retrieve token address
            address tokenAddress = initialized[keccak256(abi.encodePacked(txOriginChainId, txOriginAddress))];
            if(tokenAddress != address(0)) {
                IERC721B nft = IERC721B(tokenAddress);
                nft.safeMint(msg.sender, txId);
            }
            // Otherwise create a new token
            else {
                string memory name = userTx.name;
                string memory symbol = userTx.symbol;
                if(txOriginChainId == userTx.IDs % 10 ** 32) {
                    name = string.concat(name, " Octo");
                    symbol = string.concat(symbol, ".o");
                }
                OctoToken721 newToken = new OctoToken721(name, symbol);                
                newToken.safeMint(msg.sender, txId);

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
