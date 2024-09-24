import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import "./App.css";
import MainPage from "./features/MainPage/MainPage";
import User from "./features/User/User";
import ConnectAccountPage from "./features/ConnectAccount/ConnectAccountPage";

// function App() {
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<MainPage />}/>
          <Route path="/signup" element={<User />}/>
          <Route path="/connect-account" element={<ConnectAccountPage />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
