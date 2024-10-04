import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MainPage from "./features/MainPage/MainPage";
import SignUp from "./features/User/SignUp";
import Login from "./features/User/Login";
import ConnectAccountPage from "./features/ConnectAccount/ConnectAccountPage";
import AccountsViewPage from "./features/AccountView/AccountsViewPage";
import WelcomePage from "./features/User/WelcomPage";
import TransferPage from "./features/Transfer/TransferPage";
import LearnNews from "./features/LearnNews/LearnNews";
import AppInitializer from "./components/AppInitializer";
import TitlePage from "./titlepage";
// import { useEffect } from "react";

// function App() {
const App: React.FC = () => {

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<AppInitializer />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/connect-account" element={<ConnectAccountPage />} />
          <Route path="/account-view" element={<AccountsViewPage />}/>
          <Route path="/transfer" element={<TransferPage />}/>
          <Route path="/learn-news" element={<LearnNews />}/>
          <Route path="/title" element={<TitlePage />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
