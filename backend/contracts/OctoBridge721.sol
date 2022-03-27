// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./OctoToken721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "./interfaces/IERC721B.sol";

contract Octo721 is Ownable, ERC721Holder {
    using ECDSA for bytes32;

    uint16 immutable chainID;
    address public signer;
    uint256 private txNonces;
    mapping(address => Token) public tokens;
    mapping(uint256 => address) public nftOwners;
    mapping(bytes32 => address) public initialized;
    mapping(bytes32 => bool) private hashes;

    struct Token {
        uint16 originChain;
        address originAddress;
    }

    event TokenLocked(address indexed _user, uint16 _chainID, uint256 _nonce, uint16 _destChainID, uint256 _id, uint16 _originChainID, address _originAddress);
    event TokenClaimed(address indexed _user, uint16 _chain, address _tokenAddress, uint256 _id);

    constructor(uint16 _chainID, address _signer) {
        chainID = _chainID;
        signer = _signer;
    }

    function lock(        
        uint16 _originChain,
        uint16 _destination,
        address _tokenAddress,
        uint256 _id
    ) external {
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

        emit TokenLocked(msg.sender, chainID, txNonces, _destination, _id, _originChain, TokenInfo.originAddress);
        txNonces++;
    }

    function claim(        
        uint16 _originChain,
        uint256 _nonce,
        uint16 _midChain,
        address _originAddress,
        uint256 _id,
        bytes memory _signature,
        string memory _name,
        string memory _symbol
    ) external {
        bytes32 _hash = keccak256(abi.encodePacked(msg.sender, _midChain, chainID, _id, _originChain, _nonce, _originAddress, _name, _symbol));
        require(_hash.toEthSignedMessageHash().recover(_signature) == signer, "[claim] Couldn't verify signature.");
        require(!hashes[_hash], "[claim] Already claimed.");
        hashes[_hash] = true;

        if(_originChain == chainID) {
            IERC721B nft = IERC721B(_originAddress);
            require(nftOwners[_id] != address(0), "[claim] Token not available.");
            delete(nftOwners[_id]);
            nft.transferFrom(address(this), msg.sender, _id);
        } else {
            address _tokenAddress = initialized[keccak256(abi.encodePacked(_originChain, _originAddress))];
            if(_tokenAddress != address(0)){
                IERC721B nft = IERC721B(_tokenAddress);
                nft.safeMint(msg.sender, _id);
            } else {
                OctoToken721 newOcto = new OctoToken721(_name, _symbol);
                newOcto.safeMint(msg.sender, _id);
                initialized[keccak256(abi.encodePacked(_originChain, _originAddress))] = address(newOcto);
                Token storage TokenInfo = tokens[address(newOcto)];
                TokenInfo.originChain = _originChain;
                TokenInfo.originAddress = _originAddress;
            }
        }

        emit TokenClaimed(msg.sender, chainID, initialized[keccak256(abi.encodePacked(_originChain, _originAddress))], _id);
    }

    function isOrigin(address _tokenAddress) public view returns (bool) {
        Token memory _token = tokens[_tokenAddress];
        return (_token.originChain == chainID);
    }

    function changeSigner(address _newSigner) external onlyOwner {
        signer = _newSigner;
    }
}
