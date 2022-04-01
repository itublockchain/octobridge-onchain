// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

struct Tx {
        address user;
        address originAddress;
        uint256 IDs;
        // uint16 chainID;
        // uint16 destChainID;
        // uint16 originChainID;
        uint256 nonce;
        uint256 amount;
        string name;
        string symbol;
}

interface LayerZero {

function sendTxInfo(
        /* Layer 0 info */
        uint16 _dstChainId, bytes calldata _dstCounterMockAddress,
        /* Tx Info */
        address _user,
        uint256 IDs,
        //uint16 _chainID, 
        uint256 _nonce, 
        //uint16 _destChainID, 
        uint256 _amount, 
        //uint16 _originChainID, 
        address _originAddress,
        string memory _name,
        string memory _symbol
    ) external payable;

function resetTxInfo(address _user) external;

function txs(address _user) external view returns (Tx memory);

}