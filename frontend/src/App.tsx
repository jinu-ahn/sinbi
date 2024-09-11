import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import SignUp from "./features/User/SignupPage";
import MainPage from "./features/MainPage/MainPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
    </BrowserRouter>
  );
};

export default App;