import "./App.css";
import YellowBox from "./components/YellowBox";
import YellowButton from "./components/YellowButton";
import GreenText from "./components/GreenText";

function App() {
  return (
    <div className="bg-white flex flex-col items-center justify-center h-screen">
      <YellowBox>
        <p>hello</p>
        <input type="text" placeholder="Enter something here" />
      </YellowBox>
      <YellowButton height={70} width={80}>
        <p className="font-bold">계좌 등록</p>
      </YellowButton>
      <GreenText
        text="인증번호가 안 나오면, 문자를 보고 알려주세요"
        boldChars={["인증번호", "문자"]}
        textSize="text-[24px]"
      ></GreenText>
    </div>
  );
}

export default App;
