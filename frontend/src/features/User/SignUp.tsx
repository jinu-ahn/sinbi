import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignUpStep, stepOrder, UserData } from "./User.types";
import { useUserStore } from "./useUserStore";
import { useSpeechRecognition } from "react-speech-recognition";
import axios from "axios";
import { completeWebAuthnRegistration } from "./webauthn";
import GreenText from "../../components/GreenText";
import YellowButton from "../../components/YellowButton";
import UserLayout from "./UserLayout";

const SignUp: React.FC = () => {
  const [step, setStep] = useState<SignUpStep>(SignUpStep.Welcome);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    phoneNumber: "",
    verificationCode: "",
    simplePassword: "",
    useFaceRecognition: false,
  });
//   const [webAuthnInProgress, setWebAuthnInProgress] = useState<boolean>(false);
//   const [webAuthnError, setWebAuthnError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const { transcript, resetTranscript } = useSpeechRecognition();

  const getButtonSize = () => {
    if (window.innerWidth >= 425) {
      return { height: 140, width: 160 };
    } else if (window.innerWidth >= 375) {
      return { height: 130, width: 140 };
    } else {
      return { height: 110, width: 130 };
    }
  };
  const [buttonSize, setButtonSize] = useState(getButtonSize());

  useEffect(() => {
    const handleResize = () => {
      setButtonSize(getButtonSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    console.log("Current step:", step);
  }, [step]);

  // 문자열 enum을 사용하면서도 순차적인 단계 진행
  const handleNext = () => {
    console.log("handleNext called");
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex < stepOrder.length - 1) {
      console.log("Updating step to:", stepOrder[currentIndex + 1]);
      setStep(stepOrder[currentIndex + 1]);
    }
  };
  const handleVoiceCommand = (command: string) => {
    if (command.toLowerCase().includes("다음")) {
      handleNext();
      resetTranscript();
    }
  };

  // 입력 값 변경 처리
  const handleInputChange =
    (key: keyof UserData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserData({ ...userData, [key]: e.target.value });
    };
  // WebAuthn 등록 처리
  const handleWebAuthnRegistration = async () => {
    try {
      setIsLoading(true); // 로딩 상태 시작
      await completeWebAuthnRegistration(userData.phoneNumber);
      // 성공 시 다음 단계로 이동
      setStep(SignUpStep.Completion);
    } catch (error) {
      console.error("WebAuthn 등록 실패:", error);
      setError("WebAuthn 등록에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };
  // 회원가입 제출
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // WebAuthn 등록이 선택된 경우에만 실행
      if (userData.useFaceRecognition) {
        await completeWebAuthnRegistration(userData.phoneNumber);
      }

      // 서버에 회원가입 정보 전송
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/signup`, userData);
      
      if (response.data.success) {
        // 회원가입 성공 처리
        console.log('회원가입 성공:', response.data);
        navigate('/login'); // 로그인 페이지로 이동
      } else {
        throw new Error('회원가입 실패');
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      setError('회원가입에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 각 단계별 렌더링
  const renderStep = () => {
    switch (step) {
      case SignUpStep.Welcome:
        return (
          <>
            <GreenText text="안녕하세요! 처음 오셨나요?" boldChars={["처음"]} />
            <YellowButton
              onClick={handleNext}
              height={buttonSize.height}
              width={buttonSize.width}
            >
              네, 처음입니다
            </YellowButton>
          </>
        );
      case SignUpStep.Name:
        return (
          <>
            <GreenText text="이름을 입력해주세요." boldChars={["이름"]} />
            <input
              type="text"
              value={userData.name}
              onChange={handleInputChange("name")}
              className="w-full p-2 border rounded"
            />
            <YellowButton
              onClick={handleNext}
              height={buttonSize.height}
              width={buttonSize.width}
            >
              다음
            </YellowButton>
          </>
        );
      case SignUpStep.PhoneNumber:
        return (
          <>
            <GreenText
              text="전화번호를 입력해주세요."
              boldChars={["전화번호"]}
            />
            <input
              type="tel"
              value={userData.phoneNumber}
              onChange={handleInputChange("phoneNumber")}
              className="w-full p-2 border rounded"
            />
            <YellowButton
              onClick={handleNext}
              height={buttonSize.height}
              width={buttonSize.width}
            >
              다음
            </YellowButton>
          </>
        );
      case SignUpStep.VerificationCode:
        return (
          <>
            <GreenText
              text="인증번호를 입력해주세요."
              boldChars={["인증번호"]}
            />
            <input
              type="text"
              value={userData.verificationCode}
              onChange={handleInputChange("verificationCode")}
              className="w-full p-2 border rounded"
            />
            <YellowButton
              onClick={handleNext}
              height={buttonSize.height}
              width={buttonSize.width}
            >
              다음
            </YellowButton>
          </>
        );
      case SignUpStep.SimplePassword:
        return (
          <>
            <GreenText
              text="간편 비밀번호를 설정해주세요."
              boldChars={["간편 비밀번호"]}
            />
            <input
              type="password"
              value={userData.simplePassword}
              onChange={handleInputChange("simplePassword")}
              className="w-full p-2 border rounded"
            />
            <YellowButton
              onClick={handleNext}
              height={buttonSize.height}
              width={buttonSize.width}
            >
              다음
            </YellowButton>
          </>
        );
      case SignUpStep.FaceRecognition:
        return (
          <>
            <GreenText
              text="얼굴 인식을 사용하시겠습니까?"
              boldChars={["얼굴 인식"]}
            />
            <YellowButton
              onClick={() => {
                setUserData({ ...userData, useFaceRecognition: true });
                handleNext();
              }}
              height={buttonSize.height}
              width={buttonSize.width}
            >
              네
            </YellowButton>
            <YellowButton
              onClick={() => {
                setUserData({ ...userData, useFaceRecognition: false });
                handleNext();
              }}
              height={buttonSize.height}
              width={buttonSize.width}
            >
              아니오
            </YellowButton>
            <YellowButton
              onClick={handleNext}
              height={buttonSize.height}
              width={buttonSize.width}
            >
              다음
            </YellowButton>
          </>
        );
      case SignUpStep.FaceRegistration:
        return (
          <>
            <GreenText
              text="얼굴 인식을 시작합니다. 카메라를 응시해주세요."
              boldChars={["얼굴 인식", "카메라"]}
            />
            <YellowButton
              onClick={handleWebAuthnRegistration}
              disabled={isLoading}
            >
              {isLoading ? "처리 중..." : "얼굴 인식 시작"}
            </YellowButton>
            {error && <p className="text-red-500">{error}</p>}
            {/* 여기에 WebAuthn 얼굴 인식 로직 추가 */}
            {/* {webAuthnInProgress ? (
              <p>WebAuthn 등록 중...</p>
            ) : (
              <YellowButton
                onClick={handleWebAuthnRegistration}
                height={buttonSize.height}
                width={buttonSize.width}
              >
                얼굴 인식 시작
              </YellowButton>
            )}
            {webAuthnError && <p className="text-red-500">{webAuthnError}</p>} */}
            {/* <YellowButton
              onClick={handleWebAuthnRegistration}
              height={buttonSize.height}
              width={buttonSize.width}
            >
              얼굴 인식 시작
            </YellowButton> */}
          </>
        );
      case SignUpStep.Completion:
        return (
          <>
            <GreenText text="회원가입이 완료되었습니다!" boldChars={["완료"]} />
            <YellowButton
              onClick={handleSubmit}
              height={buttonSize.height}
              width={buttonSize.width}
            >
              시작하기
            </YellowButton>
          </>
        );
      default:
        return null;
    }
  };

  console.log("signup render", { step, userData });

  return (
    <UserLayout
      speechBubbleText="음성으로 '다음'이라고 말씀해주세요."
      speechBubbleBoldChars={["음성", "다음"]}
    >
      {renderStep()}
    </UserLayout>
  );
};

export default SignUp;
