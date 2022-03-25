import { useAccounts } from "hooks/useAccounts";
import { useRightNetwork } from "hooks/useRightNetwork";
import { useTheme } from "hooks/useTheme";
import { useWalletConnection } from "hooks/useWalletConnection";
import { useWalletEvents } from "hooks/useWalletEvents";

function App() {
  const { connectWallet, disconnect } = useWalletConnection({
    autologin: true,
  });
  const { chainId, address } = useAccounts();
  const { currentTheme, toggleTheme } = useTheme();

  const { isRightNetwork, res } = useRightNetwork();

  useWalletEvents();

  return (
    <div className={currentTheme}>
      <button onClick={connectWallet}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <div>
        {"Account address"} {address}
      </div>
      <div>
        {"Chain Id"} {chainId}
      </div>
      <button onClick={res?.fn}>Switch</button>
    </div>
  );
}

export default App;
