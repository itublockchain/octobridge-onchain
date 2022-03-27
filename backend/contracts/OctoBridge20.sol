// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./OctoToken20.sol";
import "./interfaces/IERC20B.sol";

contract Octo20 is Ownable  {
    using ECDSA for bytes32;

    uint16 immutable chainID;
    address public signer;
    uint256 private txNonces;
    mapping(address => Token) public tokens;
    mapping(bytes32 => address) public initialized;
    mapping(bytes32 => bool) private hashes;

    struct Token {
        uint16 originChain;
        address originAddress;
        uint256 lockedBalance;
    }

    event TokenLocked(address indexed _user, uint16 _chainID, uint256 _nonce, uint16 _destChainID, uint256 _amount, uint16 _originChainID, address _originAddress);
    event TokenClaimed(address indexed _user, uint16 _chain, address _tokenAddress, uint256 _amount);

    constructor(uint16 _chainID, address _signer) {
        chainID = _chainID;
        signer = _signer;
    }

    function lock(
        uint16 _originChain,
        uint16 _destination,
        address _tokenAddress,
        uint256 _amount
    ) external {
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

        emit TokenLocked(msg.sender, chainID, txNonces, _destination, _amount, _originChain, TokenInfo.originAddress);
        txNonces++;
    }

    function claim(
        uint16 _originChain,
        uint256 _nonce,
        uint16 _senderChain,
        address _originAddress,
        uint256 _amount,
        bytes memory _signature,
        string memory _name,
        string memory _symbol
    ) external {
        bytes32 _hash = keccak256(abi.encodePacked(msg.sender, _senderChain, chainID, _amount, _originChain, _nonce, _originAddress, _name, _symbol));
        require(_hash.toEthSignedMessageHash().recover(_signature) == signer, "[claim] Couldn't verify signature.");
        require(!hashes[_hash], "[claim] Already claimed.");
        hashes[_hash] = true;

        if(_originChain == chainID) {
            Token storage TokenInfo = tokens[_originAddress];
            IERC20B token = IERC20B(_originAddress);
            require(TokenInfo.lockedBalance >= _amount, "[claim] Token not available.");
            TokenInfo.lockedBalance -= _amount;
            require(token.transfer(msg.sender, _amount), "[locked] Unsuccessful token transfer.");
        } else {
            address _tokenAddress = initialized[keccak256(abi.encodePacked(_originChain, _originAddress))];
            if(_tokenAddress != address(0)){
                IERC20B token = IERC20B(_tokenAddress);
                token.mint(msg.sender, _amount);
            } else {
                OctoToken20 newOcto = new OctoToken20(_name, _symbol);
                newOcto.mint(msg.sender, _amount);
                initialized[keccak256(abi.encodePacked(_originChain, _originAddress))] = address(newOcto);
                Token storage TokenInfo = tokens[address(newOcto)];
                TokenInfo.originChain = _originChain;
                TokenInfo.originAddress = _originAddress;
            }
        }

        emit TokenClaimed(msg.sender, chainID, initialized[keccak256(abi.encodePacked(_originChain, _originAddress))], _amount);
    }

    function isOrigin(address _tokenAddress) public view returns (bool) {
        Token memory _token = tokens[_tokenAddress];
        return (_token.originChain == chainID);
    }

    function changeSigner(address _newSigner) external onlyOwner {
        signer = _newSigner;
    }
}
