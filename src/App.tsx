import { Bridge, Navbar } from "components";
import { useTheme } from "hooks/useTheme";
import { useWalletEvents } from "hooks/useWalletEvents";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ARML1 from "assets/images/arms/l1.png";
import styles from "./App.module.scss";
import { ToastContainer } from "react-toastify";

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainApp />} />
        </Routes>
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
      </BrowserRouter>
    </div>
  );
}

export default App;
