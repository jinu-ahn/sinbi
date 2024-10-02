import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MainPage from "./features/MainPage/MainPage";
import User from "./features/User/User";
import ConnectAccountPage from "./features/ConnectAccount/ConnectAccountPage";
import AccountsViewPage from "./features/AccountView/AccountsViewPage";
import TransferPage from "./features/Transfer/TransferPage";
import TitlePage from "./titlepage";

// function App() {
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/signup" element={<User />} />
          <Route path="/connect-account" element={<ConnectAccountPage />} />
          <Route path="/account-view" element={<AccountsViewPage />}/>
          <Route path="/transfer" element={<TransferPage />}/>
          <Route path="/title" element={<TitlePage />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
