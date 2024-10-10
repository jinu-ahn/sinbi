import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/api";
import { LoginDto, TokenDto } from "./User.types";
import useUserStore from "./useUserStore";
import { setCookie } from "../../utils/cookieUtils";
import FaceRecognitionLogin from "./LoginStep/FaceRecognitionLogin";
import LoginPhoneStep from "./LoginStep/LoginPhoneStep";
import LoginPWStep from "./LoginStep/LoginPWStep";

// What: 로그인 단계를 정의하는 enum
// Why: 코드의 가독성을 높이고 타입 안정성을 제공하기 위해
enum LoginStep {
  Phone,
  Face,
  Password,
}
const Login: React.FC = () => {
  const navigate = useNavigate();
  const { phone, setPhone } = useUserStore();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loginStep, setLoginStep] = useState<LoginStep>(LoginStep.Phone);

  // What: 전화번호 제출 처리
  // Why: 사용자가 입력한 전화번호의 유효성을 검사하고 다음 단계로 진행
  const handlePhoneSubmit = () => {
    if (phone.length === 11) {
      // 전화번호 형식 검증
      setLoginStep(LoginStep.Face);
    } else {
      setError("올바른 전화번호를 입력해주세요.");
    }
  };

  // What: 비밀번호 로그인 처리
  // Why: 사용자가 입력한 비밀번호로 로그인을 시도
  const handlePasswordLogin = async () => {
    try {
      const loginDto: LoginDto = { phone, password };
      const response: TokenDto = await login(loginDto);

      if (response.status === "SUCCESS") {
        console.log("로그인 성공");
        setCookie("userPhone", phone, 30);
        navigate("/main");
      } else {
        setError("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // What: 얼굴 인식 로그인 성공 처리
  // Why: 얼굴 인식 로그인이 성공했을 때 필요한 작업 수행
  const handleFaceLoginSuccess = () => {
    console.log("얼굴 인식 로그인 성공");
    setCookie("userPhone", phone, 30);
    navigate("/main");
  };

  // What: 얼굴 인식 로그인 실패 처리
  // Why: 얼굴 인식 로그인이 실패했을 때 비밀번호 로그인으로 전환
  const handleFaceLoginFailure = () => {
    setError("얼굴 인식에 실패했습니다. 비밀번호로 로그인해주세요.");
    setLoginStep(LoginStep.Password);
  };

  // What: 현재 로그인 단계에 따라 적절한 UI 렌더링
  // Why: 사용자에게 현재 단계에 맞는 UI를 제공하기 위해
  const renderLoginStep = () => {
    switch (loginStep) {
      case LoginStep.Phone:
        return (
          <LoginPhoneStep
            phone={phone}
            setPhone={setPhone}
            onSubmit={handlePhoneSubmit}
          />
        );

      case LoginStep.Face:
        return (
          <FaceRecognitionLogin
            phone={phone}
            onSuccess={handleFaceLoginSuccess}
            onFailure={handleFaceLoginFailure}
          />
        );

      case LoginStep.Password:
        return (
          <LoginPWStep
            password={password}
            setPassword={setPassword}
            onSubmit={handlePasswordLogin}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {renderLoginStep()}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;
