import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MainPage from "./features/MainPage/MainPage";
import User from "./features/User/User";
import ConnectAccountPage from "./features/ConnectAccount/ConnectAccountPage";
import AccountsViewPage from "./features/AccountView/AccountsViewPage";
import TransferPage from "./features/Transfer/TransferPage";
import LearnNews from "./features/LearnNews/LearnNewsPage";

import SimLearnNews from "./features/SimLearnNews/SimLearnNewsPage";

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
          <Route path="/sim-learn-news" element={<SimLearnNews />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
