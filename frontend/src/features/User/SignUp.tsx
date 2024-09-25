import React, { useEffect, useState } from "react";
import useUserStore from "./useUserStore";
import { LoginDto, SignUpDto, SignUpStep, TokenDto } from "./User.types";
import GreenText from "../../components/GreenText";
import YellowButton from "../../components/YellowButton";
import VoiceCommand from "./VoiceCommand";
import {
  login,
  sendPhoneNumber,
  signup,
  verificationCodeCheck,
} from "../../services/api";
import SpeechBubble from "../../components/SpeechBubble";
import { useNavigate } from "react-router-dom";
import avatar from "../../assets/avatar_img.png";
import "./User.css";
import NumberPad from "./NumberPad";
import { getCookie, setCookie } from "../../utils/cookieUtils";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(false);
  const {
    currentStep,
    name,
    phone,
    smsCode,
    password,
    confirmPassword,
    faceImage,
    setName,
    setPhone,
    setSmsCode,
    setPassword,
    setConfirmPassword,
    setFaceImage,
    nextStep,
    setStep,
  } = useUserStore();

  useEffect(() => {
    // 자동 로그인 체크
    const storedPhone = getCookie("userPhone");
    if (storedPhone) {
      setPhone(storedPhone);
      handleAutoLogin();
    } else {
      setStep(SignUpStep.Login);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Reset error when step changes
    setError(null);
  }, [currentStep]);

  const handleAutoLogin = async () => {
    try {
      // 리프레시 토큰을 사용하여 자동 로그인 시도
      // 이 부분은 백엔드 API에 따라 구현이 달라질 수 있습니다.
      const response = await login({ phone });
      if (response.data === "SUCCESS") {
        navigate("/"); // 메인 페이지로 이동
      } else {
        setStep(SignUpStep.Login);
      }
    } catch (error) {
      console.error("Auto login failed:", error);
      setStep(SignUpStep.Login);
    }
  };



  // 변경: handleSignUp 함수 추가
  const handleSignUp = async () => {
    try {
      const signUpData: SignUpDto = {
        userName: name,
        userPhone: phone,
        userPassword: password,
      };
      await signup(signUpData, faceImage || undefined);
      setCookie("userPhone", phone, 300); // 30일 동안 쿠키 저장
      setStep(SignUpStep.SignUpComplete);

      // Auto-login and navigation after a delay
      setTimeout(async () => {
        await handleLogin();
        navigate("/"); // Navigate to the start page
      }, 3000); // Wait for 3 seconds before auto-login
    } catch (error) {
      console.error("Signup failed:", error);
      setError("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // sms 인증 코드 전송 함수
  const handleSendSms = async () => {
    try {
      await sendPhoneNumber(phone);
      setError(null);
      nextStep();
    } catch (error) {
      console.error("sms 전송 실패", error);
      setError("sms 전송 실패. 다시 시도해주세요.");
    }
  };

  // SMS 인증 코드 확인 함수
  const handleVerifySms = async () => {
    try {
      const response = await verificationCodeCheck(phone, smsCode);
      if (response.status === "인증이 되었습니다.") {
        setError(null);
        nextStep();
      } else {
        setError("인증 코드가 일치하지 않습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("SMS 인증 실패:", error);
      setError("SMS 인증에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 비밀번호 일치 여부
  const handlePasswordConfirmation = () => {
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
      setStep(SignUpStep.UserPassword);
      setPassword("");
      setConfirmPassword("");
    } else {
      nextStep();
    }
  };

  const handleLogin = async () => {
    try {
      const loginDto: LoginDto = {
        phone,
        password: faceImage ? undefined : password,
      };
      const response: TokenDto = await login(loginDto, faceImage || undefined);

      // 토큰 저장은 login 함수 내에서 처리됨
      // 로그인 성공 처리
      // 로그인 성공 확인
      if (response.data === "SUCCESS") {
        console.log("로그인 성공");
        // 토큰은 이미 login 함수 내에서 저장되었으므로 여기서는 추가 처리가 필요 없음
        setCookie("userPhone", phone, 30); // 30일 동안 쿠키 저장
        navigate("/"); // 메인 페이지로 이동
      } else {
        console.error("Login failed:", error);
        setError("로그인 처리 중 오류가 발생했습니다.");
      }
      // 필요한 경우 사용자 정보를 상태나 스토어에 저장
      // 예: setUserInfo(response.userInfo);

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
            <GreenText text="이름을 알려주세요." boldChars={["이름"]} />
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
            <GreenText text="전화번호를" boldChars={["전화번호"]} />
            <GreenText text="알려주세요" boldChars={[""]} />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-field"
              pattern="^\d{2,3}\d{3,4}\d{4}$"
            />
            <YellowButton height={50} width={200} onClick={handleSendSms}>
              인증번호 받기
            </YellowButton>
          </>
        );
      case SignUpStep.SmsVerification:
        return (
          <>
            <GreenText text="인증번호가" boldChars={["인증번호"]} />
            <GreenText text="안 나오면," boldChars={[]} />
            <GreenText text="문자를 보고" boldChars={["문자"]} />
            <GreenText text="알려주세요" boldChars={[]} />
            <NumberPad value={smsCode} onChange={setSmsCode} maxLength={4} />
            <YellowButton height={50} width={200} onClick={handleVerifySms}>
              인증하기
            </YellowButton>
          </>
        );
      case SignUpStep.UserPassword:
        return (
          <>
            {error && (
              <SpeechBubble
                text={error}
                boldChars={[]}
                textSize="text-[24px]"
              />
            )}
            <GreenText text="간편비밀번호" boldChars={[""]} />
            <GreenText text="숫자 네 자리를" boldChars={["숫자 네 자리"]} />
            <GreenText text="눌러주세요" boldChars={[]} />
            {/* <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              pattern="^\d{4}$"
            /> */}
            <NumberPad value={password} onChange={setPassword} maxLength={4} />
            <YellowButton height={50} width={200} onClick={nextStep}>
              다음
            </YellowButton>
          </>
        );
      case SignUpStep.ConfirmPassword:
        return (
          <>
            <GreenText text="다시 한 번" boldChars={["다시"]} />
            <GreenText text="눌러주세요." boldChars={["눌러주세요"]} />
            <NumberPad
              value={confirmPassword}
              onChange={setConfirmPassword}
              maxLength={4}
            />
            {/* <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              pattern="^\d{4}$"
            /> */}
            <YellowButton
              height={50}
              width={200}
              onClick={handlePasswordConfirmation}
            >
              다음
            </YellowButton>
          </>
        );
      case SignUpStep.StartFaceRecognition:
        return (
          <>
            <GreenText text="얼굴로 로그인하면" boldChars={["얼굴"]} />
            <GreenText text="더 편해요." boldChars={[""]} />
            <GreenText text="등록할까요?" boldChars={["등록"]} />
            <YellowButton height={50} width={200} onClick={nextStep}>
              시작
            </YellowButton>
          </>
        );
      case SignUpStep.FaceRecognitionInProgress:
        return (
          <>
            <GreenText text="얼굴 인식" boldChars={["얼굴 인식"]} />
            <GreenText text="눈, 코, 입을" boldChars={["눈, 코, 입"]} />
            <GreenText text="화면에 맞춰주세요" boldChars={["화면"]} />
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
            <GreenText text="회원가입 끝!" boldChars={["끝"]} />
            <GreenText text="첫 화면으로" boldChars={["첫 화면"]} />
            <GreenText text="갈게요" boldChars={[""]} />
            {/* <YellowButton
              height={50}
              width={200}
              onClick={() => setStep(SignUpStep.Login)}
            >
              로그인하기
            </YellowButton> */}
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
