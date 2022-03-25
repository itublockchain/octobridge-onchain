import { Bridge, Navbar } from "components";
import { useTheme } from "hooks/useTheme";
import { useWalletEvents } from "hooks/useWalletEvents";
import { BrowserRouter, Route, Routes } from "react-router-dom";

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
      </BrowserRouter>
    </div>
  );
}

export default App;
