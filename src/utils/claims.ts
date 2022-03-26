export class Claims {
  _mainChain: any;
  _midChain: any;
  _mainAddress: any;
  _amount: any;
  _signature: any;
  _name: any;
  _symbol: any;

  constructor(
    _mainChain: any,
    _midChain: any,
    _mainAddress: any,
    _amount: any,
    _signature: any,
    _name: any,
    _symbol: any
  ) {
    this._mainChain = _mainChain;
    this._midChain = _midChain;
    this._mainAddress = _mainAddress;
    this._amount = _amount;
    this._signature = _signature;
    this._name = _name;
    this._symbol = _symbol;
  }
}
