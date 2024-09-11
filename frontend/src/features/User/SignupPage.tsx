import React from "react";
import avatar from "../../assets/avatar.png";
import FirstTime from "./AskFirstTime";
import LetsSignup from "./LetsSignup";
import SignupVoiceCommand from "./SignupVoiceCommand";
import { useSignupStore } from "./SignupStore";

const SignUp: React.FC = () => {
  const { step } = useSignupStore();

  const renderComponent = () => {
    switch (step) {
      case 0:
        return <FirstTime />;
      case 1:
        return <LetsSignup />;
      // case 별 컴포넌트 추가해나가면 됨
      default:
        return <FirstTime />;
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-8">
      {renderComponent()}

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[318px] h-[204px]">
        <img src={avatar} alt="Avatar" className="w-full h-full object-contain" />
      </div>

      <SignupVoiceCommand />
    </div>
  );
};

export default SignUp;