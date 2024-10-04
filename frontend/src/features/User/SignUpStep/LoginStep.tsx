// src/components/User/SignUpStep/LoginStep.tsx
import React from 'react';
import GreenText from "../../../components/GreenText";
import YellowButton from "../../../components/YellowButton";

interface LoginStepProps {
  phone: string;
  setPhone: (phone: string) => void;
  password: string;
  setPassword: (password: string) => void;
  onLogin: () => void;
}

const LoginStep: React.FC<LoginStepProps> = ({ phone, setPhone, password, setPassword, onLogin }) => {
  return (
    <>
      <GreenText text="로그인" boldChars={["로그인"]} />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="input-field"
        placeholder="전화번호"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
        placeholder="비밀번호"
      />
      <YellowButton height={50} width={200} onClick={onLogin}>
        로그인
      </YellowButton>
    </>
  );
};

export default LoginStep;