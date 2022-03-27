import { Bridge, Navbar } from "components";
import { useTheme } from "hooks/useTheme";
import { useWalletEvents } from "hooks/useWalletEvents";
import { NftBridge } from "pages";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainApp = () => {
  return (
    <div className="app">
      <Navbar />
      <Bridge />
    </div>
  );
};

function App() {
  useWalletEvents();
  const { currentTheme } = useTheme();

  return (
    <div className={currentTheme}>
      <MainApp />
      {/*  <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/nft" element={<NftBridge />} />
        </Routes>
      </BrowserRouter> */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={currentTheme}
      />
    </div>
  );
}

export default App;
