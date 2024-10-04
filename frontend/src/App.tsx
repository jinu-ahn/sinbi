import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MainPage from "./features/MainPage/MainPage";
import User from "./features/User/User";
import ConnectAccountPage from "./features/ConnectAccount/ConnectAccountPage";
import AccountsViewPage from "./features/AccountView/AccountsViewPage";
import TransferPage from "./features/Transfer/TransferPage";
import LearnNews from "./features/LearnNews/LearnNews";

import SimMainPage from "./features/SimulationMainPage/SimMainPage";
import SimConnectAccountPage from "./features/SimulationConnectAccount/SimConnectAccountPage";
import SimAccountsViewPage from "./features/SimulationAccountView/SimAccountsViewPage";
import SimTransferPage from "./features/SimulationTransfer/SimTransferPage";

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
          <Route path="/learn-news" element={<LearnNews />}/>


          <Route path="/sim" element={<SimMainPage />} />
          <Route path="/sim-connect-account" element={<SimConnectAccountPage />}/>
          <Route path="/sim-account-view" element={<SimAccountsViewPage />}/>
          <Route path="/sim-transfer" element={<SimTransferPage />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
