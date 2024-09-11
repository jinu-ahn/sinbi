import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import "./App.css";
// import YellowBox from "./components/YellowBox";
// import YellowButton from "./components/YellowButton";
import MainPage from "./features/MainPage/MainPage";

// function App() {
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<MainPage />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
