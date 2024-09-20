import React, { useEffect, useState } from "react";
import useUserStore from "./useUserStore";
import { LoginDto, SignUpDto, SignUpStep } from "./User.types";
import GreenText from "../../components/GreenText";
import YellowButton from "../../components/YellowButton";
import VoiceCommand from "./VoiceCommand";
import { login, signup } from "../../services/api";
import SpeechBubble from "../../components/SpeechBubble";
import { useNavigate } from "react-router-dom";

const User: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(false);
  const {
    currentStep,
    name,
    phone,
    password,
    confirmPassword,
    faceImage,
    setName,
    setPhone,
    setPassword,
    setConfirmPassword,
    setFaceImage,
    nextStep,
    setStep,
  } = useUserStore();

  useEffect(() => {
    // Reset error when step changes
    setError(null);
  }, [currentStep]);

  // 변경: handleSignUp 함수 추가
  const handleSignUp = async () => {
    try {
        console.log('111')
      const signUpData: SignUpDto = {
        userName: name,
        userPhone: phone,
        userPassword: password
      };
      console.log(signUpData)
      await signup(signUpData)//, faceImage || undefined);
      console.log(333)
      setStep(SignUpStep.SignUpComplete);
      console.log(444)
    } catch (error) {
      console.error('Signup failed:', error);
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleLogin = async () => {
    try {
      const loginDto: LoginDto = {
        phone,
        password: faceImage ? undefined : password,
      };
      const response = await login(loginDto, faceImage || undefined);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      setStep(SignUpStep.ServiceIntro);
    } catch (error) {
      console.error("Login failed:", error);
      setError("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case SignUpStep.Welcome:
        return (
          <>
            <GreenText text="안녕하세요!" boldChars={["안녕하세요"]} />
            <GreenText text="저는 신비예요." boldChars={["신비"]} />
            <GreenText text="같이 회원가입을" boldChars={["회원가입"]} />
            <GreenText text="해볼까요?" boldChars={[]} />
            <YellowButton height={50} width={200} onClick={nextStep}>
              시작하기
            </YellowButton>
          </>
        );
      case SignUpStep.UserName:
        return (
          <>
            <GreenText text="이름을 입력해주세요." boldChars={["이름"]} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
            <YellowButton height={50} width={200} onClick={nextStep}>
              다음
            </YellowButton>
          </>
        );
      case SignUpStep.UserPhone:
        return (
          <>
            <GreenText
              text="전화번호를 입력해주세요."
              boldChars={["전화번호"]}
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-field"
              pattern="^\d{2,3}\d{3,4}\d{4}$"
            />
            <YellowButton height={50} width={200} onClick={nextStep}>
              다음
            </YellowButton>
          </>
        );
      case SignUpStep.UserPassword:
        return (
          <>
            <GreenText
              text="비밀번호를 입력해주세요."
              boldChars={["비밀번호"]}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              pattern="^\d{4}$"
            />
            <YellowButton height={50} width={200} onClick={nextStep}>
              다음
            </YellowButton>
          </>
        );
      case SignUpStep.ConfirmPassword:
        return (
          <>
            <GreenText
              text="비밀번호를 다시 입력해주세요."
              boldChars={["비밀번호"]}
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              pattern="^\d{4}$"
            />
            <YellowButton height={50} width={200} onClick={nextStep}>
              다음
            </YellowButton>
          </>
        );
      case SignUpStep.StartFaceRecognition:
        return (
          <>
            <GreenText
              text="얼굴 인식을 시작합니다."
              boldChars={["얼굴 인식"]}
            />
            <YellowButton height={50} width={200} onClick={nextStep}>
              시작
            </YellowButton>
          </>
        );
      case SignUpStep.FaceRecognitionInProgress:
        return (
          <>
            <GreenText text="얼굴 인식 중입니다." boldChars={["얼굴 인식"]} />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && setFaceImage(e.target.files[0])
              }
              className="file-input"
            />
            <YellowButton height={50} width={200} onClick={handleSignUp}>
              회원가입 완료
            </YellowButton>
          </>
        );
      case SignUpStep.FaceRecognitionComplete:
        return (
          <>
            <GreenText
              text="얼굴 인식이 완료되었습니다."
              boldChars={["완료"]}
            />
            <YellowButton height={50} width={200} onClick={handleSignUp}>
              회원가입 완료
            </YellowButton>
          </>
        );
      case SignUpStep.SignUpComplete:
        return (
          <>
            <GreenText text="회원가입이 완료되었습니다!" boldChars={["완료"]} />
            <YellowButton
              height={50}
              width={200}
              onClick={() => setStep(SignUpStep.Login)}
            >
              로그인하기
            </YellowButton>
          </>
        );
      //   case SignUpStep.Completed:
      //     return (
      //       <>
      //         <GreenText text="회원가입이 완료되었습니다!" boldChars={["완료"]} />
      //         <SpeechBubble
      //           text="서비스 이용을 시작해보세요."
      //           boldChars={["서비스"]}
      //         />
      //         <YellowButton height={50} width={200} onClick={() => navigate("/")}>
      //           홈으로
      //         </YellowButton>
      //       </>
      //     );
      case SignUpStep.Login:
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
            <YellowButton height={50} width={200} onClick={handleLogin}>
              로그인
            </YellowButton>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="user-container">
      {renderStep()}
      {error && <p className="error-message">{error}</p>}
      {/* <button className="switch-mode-button" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "회원가입으로 전환" : "로그인으로 전환"}
      </button> */}
      <VoiceCommand />
    </div>
  );
};

export default User;
