import React from "react";
import { useNavigate } from "react-router-dom";
import GreenText from "../../components/GreenText";
import YellowButton from "../../components/YellowButton";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <GreenText text="저희 은행 비서가" boldChars={["은행 비서"]} />
      <GreenText text="처음이신가요?" boldChars={["처음"]} />
      <div className="mt-8 space-y-4">
        <YellowButton height={50} width={200} onClick={() => navigate("/signup")}>
          네, 처음이에요
        </YellowButton>
        <YellowButton height={50} width={200} onClick={() => navigate("/login")}>
          아니요, 해봤어요
        </YellowButton>
      </div>
    </div>
  );
};

export default WelcomePage;