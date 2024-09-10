import "regenerator-runtime/runtime";
import "./App.css";
import YellowBox from "./components/YellowBox";
import YellowButton from "./components/YellowButton";

function Home() {
  return (
    // 시험하게 만든 간한한 홈 화면
    <div className="bg-white flex flex-col items-center justify-center h-screen">
      <YellowBox>
        <p>hello</p>
        <input type="text" placeholder="Enter something here" />
      </YellowBox>
      <YellowButton height={70} width={80}>
        <p className="font-bold">계좌 등록</p>
      </YellowButton>
    </div>
  );
}

export default Home;
