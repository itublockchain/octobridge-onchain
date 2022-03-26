export class Claims {
  _mainChain: any;
  _midChain: any;
  _mainAddress: any;
  _amount: any;
  _signature: any;
  _name: any;
  _symbol: any;
  _nonce: any;
  _originNetworkId: any;
  _originTokenAddress: any;
  _currentNetworkId: any;
  _tokenOriginId: any;
  _targetNetworkChainId: any;
  _claimContractAddr: any;

  constructor(
    _mainChain: any,
    _midChain: any,
    _mainAddress: any,
    _amount: any,
    _signature: any,
    _name: any,
    _symbol: any,
    _nonce: any,
    _originNetworkId: any,
    _originTokenAddress: any,
    _currentNetworkId: any,
    _tokenOriginId: any,
    _targetNetworkChainId: any,
    _claimContractAddr: any
  ) {
    this._mainChain = _mainChain;
    this._midChain = _midChain;
    this._mainAddress = _mainAddress;
    this._amount = _amount;
    this._signature = _signature;
    this._name = _name;
    this._symbol = _symbol;
    this._nonce = _nonce;
    this._originNetworkId = _originNetworkId;
    this._originTokenAddress = _originTokenAddress;
    this._currentNetworkId = _currentNetworkId;
    this._tokenOriginId = _tokenOriginId;
    this._targetNetworkChainId = _targetNetworkChainId;
    this._claimContractAddr = _claimContractAddr;
  }
}
