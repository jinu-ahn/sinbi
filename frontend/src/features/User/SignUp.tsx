import React, { useEffect, useState } from "react";
import useUserStore from "./useUserStore";
import { LoginDto, SignUpDto, SignUpStep, TokenDto } from "./User.types";
import VoiceCommand from "./VoiceCommand";
import {
  login,
  sendPhoneNumber,
  signup,
  verificationCodeCheck,
} from "../../services/api";
import { useNavigate } from "react-router-dom";
import avatar from "../../assets/avatar.png";
import "./User.css";
import { getCookie, setCookie } from "../../utils/cookieUtils";
import FaceRecognitionStep from "./SignUpStep/FaceRecognitionStep";
import WelcomeStep from "./SignUpStep/WelcomeStep";
import UserNameStep from "./SignUpStep/UserNameStep";
import UserPhoneStep from "./SignUpStep/UserPhoneStep";
import SmsVerificationStep from "./SignUpStep/SmsVerificationStep";
import UserPasswordStep from "./SignUpStep/UserPasswordStep";
import ConfirmPasswordStep from "./SignUpStep/ConfirmPasswordStep";
import StartFaceRecognitionStep from "./SignUpStep/StartFaceRecognitionStep";
import FaceRecognitionCompleteStep from "./SignUpStep/FaceRecognitionCompleteStep";
import SignUpCompleteStep from "./SignUpStep/SignUpCompleteStep";
import LoginStep from "./SignUpStep/LoginStep";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  // const [error, setError] = useState<string | null>(null);
  const { currentStep, error, setPhone, setStep } = useUserStore();

  // const {
  //   currentStep,
  //   name,
  //   phone,
  //   smsCode,
  //   password,
  //   confirmPassword,
  //   faceImage,
  //   setName,
  //   setPhone,
  //   setSmsCode,
  //   setPassword,
  //   setConfirmPassword,
  //   nextStep,
  //   setStep,
  // } = useUserStore();

  useEffect(() => {
    // 자동 로그인 체크
    const storedPhone = getCookie("userPhone");
    if (storedPhone) {
      setPhone(storedPhone);
      handleAutoLogin();
    } else {
      setStep(SignUpStep.Welcome);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   // Reset error when step changes
  //   setError(null);
  // }, [currentStep]);

  const handleAutoLogin = async () => {
    try {
      const storedPhone = getCookie("userPhone");
      if (!storedPhone) {
        setStep(SignUpStep.Login);
        return;
      }
      // What: 자동 로그인 시도
      // Why: 사용자 경험 개선을 위해 저장된 정보로 자동 로그인
      const response = await login({ phone: storedPhone });
      if (response.status === "SUCCESS") {
        navigate("/main"); // 메인 페이지로 이동
      } else {
        setStep(SignUpStep.Login);
      }
    } catch (error) {
      console.error("Auto login failed:", error);
      setStep(SignUpStep.Login);
    }
  };

  // // 변경: handleSignUp 함수 추가
  // const handleSignUp = async () => {
  //   try {
  //     const signUpData: SignUpDto = {
  //       userName: name,
  //       userPhone: phone,
  //       userPassword: password,
  //     };
  //     const response = await signup(signUpData, faceImage);
  //     console.log("signup 전체 response:", response);
  //     setCookie("userPhone", phone, 300); // 30일 동안 쿠키 저장
  //     // setStep(SignUpStep.SignUpComplete);
  //     console.log("Signup successful, attempting auto-login");
  //     // Auto-login and navigation after a delay
  //     // setTimeout(async () => {
  //     //   await handleLogin();
  //     //   navigate("/"); // Navigate to the start page
  //     // }, 3000); // Wait for 3 seconds before auto-login
  //     // What: 회원가입 후 자동 로그인
  //     // Why: 사용자 경험 향상
  //     const loginResponse = await login({ phone, password });
  //     console.log("오토로그인 response:", loginResponse);

  //     if (loginResponse.status === "SUCCESS") {
  //       navigate("/sim");
  //     } else {
  //       setError("자동 로그인에 실패했습니다. 다시 로그인해주세요.");
  //       navigate("/login");
  //     }
  //   } catch (error) {
  //     console.error("Signup failed:", error);
  //     setError("회원가입에 실패했습니다. 다시 시도해주세요.");
  //   }
  // };

  // // sms 인증 코드 전송 함수
  // const handleSendSms = async () => {
  //   try {
  //     await sendPhoneNumber(phone);
  //     setError(null);
  //     nextStep();
  //   } catch (error) {
  //     console.error("sms 전송 실패", error);
  //     setError("sms 전송 실패. 다시 시도해주세요.");
  //   }
  // };

  // // SMS 인증 코드 확인 함수
  // const handleVerifySms = async () => {
  //   try {
  //     const response = await verificationCodeCheck(phone, smsCode);
  //     if (response.status === "인증이 되었습니다.") {
  //       setError(null);
  //       nextStep();
  //     } else {
  //       setError("인증 코드가 일치하지 않습니다. 다시 시도해주세요.");
  //     }
  //   } catch (error) {
  //     console.error("SMS 인증 실패:", error);
  //     setError("SMS 인증에 실패했습니다. 다시 시도해주세요.");
  //   }
  // };

  // // 비밀번호 일치 여부
  // const handlePasswordConfirmation = () => {
  //   if (password !== confirmPassword) {
  //     setError("비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
  //     setStep(SignUpStep.UserPassword);
  //     setPassword("");
  //     setConfirmPassword("");
  //   } else {
  //     nextStep();
  //   }
  // };

  // const handleLogin = async () => {
  //   try {
  //     const loginDto: LoginDto = {
  //       phone,
  //       password: faceImage ? undefined : password,
  //     };
  //     const response: TokenDto = await login(loginDto, faceImage || undefined);

  //     // 토큰 저장은 login 함수 내에서 처리됨
  //     // 로그인 성공 처리
  //     // 로그인 성공 확인
  //     console.log("response", response);
  //     if (response.status === "SUCCESS") {
  //       console.log("로그인 성공");
  //       // 토큰은 이미 login 함수 내에서 저장되었으므로 여기서는 추가 처리가 필요 없음
  //       setCookie("userPhone", phone, 30); // 30일 동안 쿠키 저장
  //       navigate("/main"); // 메인 페이지로 이동
  //     } else {
  //       console.error("Login failed:", error);
  //       setError("로그인 처리 중 오류가 발생했습니다.");
  //     }
  //     // 필요한 경우 사용자 정보를 상태나 스토어에 저장
  //     // 예: setUserInfo(response.userInfo);
  //   } catch (error) {
  //     console.error("Login failed:", error);
  //     setError("로그인에 실패했습니다. 다시 시도해주세요.");
  //   }
  // };

  const renderStep = () => {
    switch (currentStep) {
      case SignUpStep.Welcome:
        return <WelcomeStep />;
      case SignUpStep.UserName:
        return <UserNameStep />;
      case SignUpStep.UserPhone:
        return <UserPhoneStep />;

      case SignUpStep.SmsVerification:
        return <SmsVerificationStep />;
      case SignUpStep.UserPassword:
        return <UserPasswordStep />;

      case SignUpStep.ConfirmPassword:
        return <ConfirmPasswordStep />;
      case SignUpStep.StartFaceRecognition:
        return <StartFaceRecognitionStep />;
      case SignUpStep.FaceRecognitionInProgress:
        return <FaceRecognitionStep />;
      case SignUpStep.FaceRecognitionComplete:
        return <FaceRecognitionCompleteStep />;
      case SignUpStep.SignUpComplete:
        return <SignUpCompleteStep />;
      case SignUpStep.Login:
        return (
          <LoginStep/>
         
        );
      default:
        return null;
    }
  };

  return (
    <div className="user-container relative flex min-h-screen flex-col items-center justify-between py-8">
      {/* Wrap the existing content in a div */}
      <div className="z-10 flex w-full max-w-md flex-grow flex-col items-center justify-center">
        {renderStep()}
        {error && <p className="error-message">{error}</p>}
      </div>

      {/* Add the avatar image */}
      <div className="absolute bottom-0 left-1/2 z-0 h-[204px] w-[318px] -translate-x-1/2 transform">
        <img
          src={avatar}
          alt="Avatar"
          className="h-full w-full object-contain"
        />
      </div>
      {/* <button className="switch-mode-button" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "회원가입으로 전환" : "로그인으로 전환"}
      </button> */}
      <VoiceCommand />
    </div>
  );
};

export default SignUp;
