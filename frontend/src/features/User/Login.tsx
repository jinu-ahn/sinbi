import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/api";
import { LoginDto, TokenDto } from "./User.types";
import useUserStore from "./useUserStore";
import GreenText from "../../components/GreenText";
import YellowButton from "../../components/YellowButton";
import NumberPad from "./NumberPad";
import { setCookie } from "../../utils/cookieUtils";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { phone, setPhone } = useUserStore();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      const loginDto: LoginDto = {
        phone,
        password,
      };
      const response: TokenDto = await login(loginDto);

      if (response.data === "SUCCESS") {
        console.log("로그인 성공");
        setCookie("userPhone", phone, 30); // 30일 동안 쿠키 저장
        navigate("/"); // 메인 페이지로 이동
      } else {
        setError("로그인 처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <GreenText text="전화번호를" boldChars={["전화번호"]} />
      <GreenText text="알려주세요" boldChars={[""]} />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="input-field"
        placeholder="전화번호"
      />
      <NumberPad value={password} onChange={setPassword} maxLength={4} />
      <YellowButton height={50} width={200} onClick={handleLogin}>
        로그인
      </YellowButton>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;