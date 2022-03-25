import { useAccounts } from "hooks/useAccounts";
import { useModal } from "hooks/useModal";
import { useRightNetwork } from "hooks/useRightNetwork";
import { useTheme } from "hooks/useTheme";
import { useWalletConnection } from "hooks/useWalletConnection";
import { useWalletEvents } from "hooks/useWalletEvents";
import { Modal } from "ui";

function App() {
  const { connectWallet, disconnect } = useWalletConnection({
    autologin: true,
  });
  const { chainId, address } = useAccounts();
  const { currentTheme, toggleTheme } = useTheme();

  const { isRightNetwork, res } = useRightNetwork();

  useWalletEvents();

  const testModal = useModal();

  return (
    <div className={currentTheme}>
      <Modal isOpen={testModal.isOpen} close={testModal.close}>
        selam
      </Modal>
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
      <button onClick={testModal.open}>Modal</button>
    </div>
  );
}

export default App;
