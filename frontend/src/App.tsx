import "./App.css";
import YellowBox from "./components/YellowBox";
import YellowButton from "./components/YellowButton";

function App() {
  return (
    <div className="bg-white flex flex-col items-center justify-center h-screen">
      <YellowBox>
        <p>hello</p>
        <input type="text" placeholder="Enter something here" />
      </YellowBox>
      <YellowButton>
        <p className="font-bold">계좌 등록</p>
      </YellowButton>
    </div>
  );
}

export default App;
