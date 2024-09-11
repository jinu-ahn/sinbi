import "./App.css";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import SignUp from "./features/User/SignupPage";

function App() {
  return (
    <BrowserRouter>
      <div>
        <SignUp />

        <Routes>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
