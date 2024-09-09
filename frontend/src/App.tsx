import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import "./App.css";
// import YellowBox from "./components/YellowBox";
// import YellowButton from "./components/YellowButton";
import MainPage from "./MainPage";

// function App() {
const App: React.FC = () => {
  return (
    // <div className="bg-white flex flex-col items-center justify-center h-screen">
    //   <YellowBox>
    //     <p>hello</p>
    //     <input type="text" placeholder="Enter something here" />
    //   </YellowBox>
    //   <YellowButton height={70} width={80}>
    //     <p className="font-bold">계좌 등록</p>
    //   </YellowButton>
    // </div>
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
