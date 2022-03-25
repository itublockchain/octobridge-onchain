import Web3Modal from "web3modal";
import { providerOptions } from "utils/providerOptions";
import { useState } from "react";
import { ethers } from "ethers";

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions,
  theme: "dark",
});

function App() {
  const [provider, setProvider] = useState();
  const [error, setError] = useState<any>();
  const [library, setLibrary] = useState<any>();
  const [account, setAccount] = useState<any>();
  const [chainId, setChainId] = useState<any>();

  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();
      const network = await library.getNetwork();
      setProvider(provider);
      setLibrary(library);
      if (accounts) setAccount(accounts[0]);
      setChainId(network.chainId);
    } catch (error) {
      setError(error);
    }
  };

  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
  };

  return (
    <div>
      <button onClick={connectWallet}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
      <div>
        {"Account"} {account}
      </div>
      <div>
        {"Chain Id"} {chainId}
      </div>
    </div>
  );
}

export default App;
