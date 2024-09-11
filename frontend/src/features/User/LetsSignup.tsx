import React from "react";
import GreenText from "../../components/GreenText";

const LetsSignup: React.FC = () => {
  return (
      <div className="m-1 py-8">
        <GreenText text="안녕하세요!" boldChars={["안녕하세요!"]} />
        <GreenText text="저는 신비예요." boldChars={["신비"]} />
        <GreenText text="같이 회원가입을" boldChars={["회원가입"]} />
        <GreenText text="해볼까요?" boldChars={[]} />
      </div>
  );
};

export default LetsSignup;