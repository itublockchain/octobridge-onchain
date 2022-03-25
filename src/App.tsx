import { Navbar } from "components";
import { useAccounts } from "hooks/useAccounts";
import { useModal } from "hooks/useModal";
import { useRightNetwork } from "hooks/useRightNetwork";
import { useTheme } from "hooks/useTheme";
import { useWalletConnection } from "hooks/useWalletConnection";
import { useWalletEvents } from "hooks/useWalletEvents";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Modal } from "ui";

const MainApp = () => {
  const testModal = useModal();
  const { connectWallet, disconnect } = useWalletConnection({
    autologin: true,
  });
  const { chainId, address } = useAccounts();
  const { toggleTheme } = useTheme();
  const { res } = useRightNetwork();

  return (
    <>
      <Modal isOpen={testModal.isOpen} close={testModal.close}>
        selam
      </Modal>
      <div className="app">
        <Navbar />
      </div>
    </>
  );
};

function App() {
  useWalletEvents();
  const { currentTheme } = useTheme();

  return (
    <div className={currentTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainApp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
