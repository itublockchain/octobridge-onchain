// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.4;
pragma abicoder v2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ILayerZeroReceiver.sol";
import "./interfaces/ILayerZeroEndpoint.sol";
import "./interfaces/ILayerZeroUserApplicationConfig.sol";

contract TxRelayer is Ownable, ILayerZeroReceiver, ILayerZeroUserApplicationConfig {
    mapping(address => bool) public allowed;
    mapping(address => Tx) public txs;

    struct Tx {
        address user;
        address originAddress;
        uint256 IDs;
        // uint16 chainID;
        // uint16 destChainID;
        // uint16 mainChainID;
        uint256 nonce;
        uint256 amount;
        string name;
        string symbol;
    }

    // keep track of how many messages have been received from other chains
    // required: the LayerZero endpoint which is passed in the constructor
    ILayerZeroEndpoint public endpoint;
    mapping(uint16 => bytes) public remotes;

    constructor(address _endpoint) {
        endpoint = ILayerZeroEndpoint(_endpoint);
        allowed[msg.sender] = true;
    }

    // Allow access for bridge, only owner can call it
    function allowBridge(address contractAddress) external onlyOwner {
        allowed[contractAddress] = true;
    }

    // Revokes access of bridge, only owner can call it
    function revokeBridge(address contractAddress) external onlyOwner {
        allowed[contractAddress] = true;
    }

    // overrides lzReceive function in ILayerZeroReceiver.
    // automatically invoked on the receiving chain after the source chain calls endpoint.send(...)
    function lzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64, /*_nonce*/
        bytes memory _payload/*_payload*/
    ) external override {
        // boilerplate: only allow this endpiont to be the caller of lzReceive!
        require(msg.sender == address(endpoint));
        // owner must have setRemote() to allow its remote contracts to send to this contract
        require(
            _srcAddress.length == remotes[_srcChainId].length && keccak256(_srcAddress) == keccak256(remotes[_srcChainId]),
            "Invalid remote sender address. owner should call setRemote() to enable remote contract"
        );

        (address user,
        uint256 IDs,
        // uint16 chainID,
        uint256 nonce,
        // uint16 destChainID,
        uint256 amount,
        // uint16 mainChainID,
        address mainAddress,
        string memory name,
        string memory symbol) = abi.decode(_payload, (address, uint256, uint256, uint256, address, string, string));

        txs[user] = Tx(
            user, 
            mainAddress,
            IDs,
            // chainID, 
            // destChainID, 
            // mainChainID, 
            nonce,
            amount,
            name,
            symbol
        );
    }

    // custom function that wraps endpoint.send(...) which will
    // cause lzReceive() to be called on the destination chain!
    function sendTxInfo(
        /* Layer 0 info */
        uint16 _dstChainId, bytes calldata _dstContractAddress, 
        /* Tx Info */
        address _user,
        uint256 IDs, 
        // uint16 _chainID, 
        uint256 _nonce, 
        // uint16 _destChainID, 
        uint256 _amount, 
        // uint16 _mainChainID, 
        address _originAddress,
        string memory _name,
        string memory _symbol
    ) public payable {
        require(allowed[msg.sender], "Contract isn't allowed");

        // Pack and send message to endpoint
        bytes memory trial = abi.encode(_user, IDs, _nonce, _amount, _originAddress, _name, _symbol);
        endpoint.send{value: msg.value}(_dstChainId, _dstContractAddress, trial, payable(msg.sender), address(0x0), bytes(""));
    }

    function resetTxInfo(address user) external {
        require(allowed[msg.sender], "Contract isn't allowed");
        delete txs[user];
    }
    
    // LAYER 0 CONFIGURATION

    function setConfig(
        uint16, /*_version*/
        uint16 _chainId,
        uint _configType,
        bytes calldata _config
    ) external override {
        endpoint.setConfig(endpoint.getSendVersion(address(this)), _chainId, _configType, _config);
    }

    function getConfig(
        uint16, /*_dstChainId*/
        uint16 _chainId,
        address,
        uint _configType
    ) external view returns (bytes memory) {
        return endpoint.getConfig(endpoint.getSendVersion(address(this)), _chainId, address(this), _configType);
    }

    function setSendVersion(uint16 version) external override {
        endpoint.setSendVersion(version);
    }

    function setReceiveVersion(uint16 version) external override {
        endpoint.setReceiveVersion(version);
    }

    function getSendVersion() external view returns (uint16) {
        return endpoint.getSendVersion(address(this));
    }

    function getReceiveVersion() external view returns (uint16) {
        return endpoint.getReceiveVersion(address(this));
    }

    function forceResumeReceive(uint16 _srcChainId, bytes calldata _srcAddress) external override {
        //
    }

    // set the Oracle to be used by this UA for LayerZero messages
    function setOracle(uint16 dstChainId, address oracle) external {
        uint TYPE_ORACLE = 6; // from UltraLightNode
        // set the Oracle
        endpoint.setConfig(
            endpoint.getSendVersion(address(this)),
            dstChainId,
            TYPE_ORACLE,
            abi.encode(oracle)
        );
    }

    // _chainId - the chainId for the remote contract
    // _remoteAddress - the contract address on the remote chainId
    // the owner must set remote contract addresses.
    // in lzReceive(), a require() ensures only messages
    // from known contracts can be received.
    function setRemote(uint16 _chainId, bytes calldata _remoteAddress) external onlyOwner {
        require(remotes[_chainId].length == 0, "The remote address has already been set for the chainId!");
        remotes[_chainId] = _remoteAddress;
    }

    // set the inbound block confirmations
    function setInboundConfirmations(uint16 remoteChainId, uint16 confirmations) external {
        endpoint.setConfig(
            endpoint.getSendVersion(address(this)),
            remoteChainId,
            2, // CONFIG_TYPE_INBOUND_BLOCK_CONFIRMATIONS
            abi.encode(confirmations)
        );
    }

    // set outbound block confirmations
    function setOutboundConfirmations(uint16 remoteChainId, uint16 confirmations) external {
        endpoint.setConfig(
            endpoint.getSendVersion(address(this)),
            remoteChainId,
            5, // CONFIG_TYPE_OUTBOUND_BLOCK_CONFIRMATIONS
            abi.encode(confirmations)
        );
    }

    // allow this contract to receive ether
    fallback() external payable {}
    receive() external payable {}
}