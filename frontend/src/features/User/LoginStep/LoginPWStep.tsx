import React from "react";
import GreenText from "../../../components/GreenText";
import YellowButton from "../../../components/YellowButton";
import NumberPad from "../NumberPad";

interface PasswordStepProps {
  password: string;
  setPassword: (password: string) => void;
  onSubmit: () => void;
}

const PasswordStep: React.FC<PasswordStepProps> = ({ password, setPassword, onSubmit }) => {
  return (
    <>
      <GreenText text="비밀번호를" boldChars={["비밀번호"]} />
      <GreenText text="입력해주세요" boldChars={[""]} />
      <NumberPad value={password} onChange={setPassword} maxLength={4} />
      <YellowButton height={50} width={200} onClick={onSubmit}>
        로그인
      </YellowButton>
    </>
  );
};

export default PasswordStep;