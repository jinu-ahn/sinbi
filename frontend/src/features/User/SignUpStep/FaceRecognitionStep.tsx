// FaceRecognitionStep.tsx
import React, { useEffect, useRef, useState } from "react";
import GreenText from "../../../components/GreenText";
import YellowButton from "../../../components/YellowButton";
import useUserStore from "../useUserStore";
// import { tokenStorage } from "./tokenUtils"; // 토큰 저장소 import
// import { signup, login } from "../../../services/api"; // API 함수 import
import FaceRecAudio from "../../../assets/audio/53_얼굴을_인식할게요_눈_코_입을_화면에_맞춰주세요.mp3"

interface FaceRecognitionStepProps {
  onComplete: () => void;
}

const FaceRecognitionStep: React.FC<FaceRecognitionStepProps> = ({
  onComplete,
}) => {
  const { setFaceImage, name, phone, password, faceImage } = useUserStore();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // What: 이미지 파일 선택 처리
  // Why: 사용자가 선택한 이미지를 미리보기로 표시하고 상태에 저장
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFaceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // What: 카메라 열기
  // Why: 사용자가 직접 사진을 찍을 수 있도록 함
  const openCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // // What: 회원가입 및 로그인 처리
  // // Why: 얼굴 인식 정보를 포함하여 회원가입을 완료하고 자동 로그인
  // const handleSignUpAndLogin = async () => {
  //   try {
  //     const signUpData = {
  //       userName: name,
  //       userPhone: phone,
  //       userPassword: password,
  //     };

  //     console.log("SignUp Data:", signUpData);
  //     console.log("Face Image:", faceImage);

  //     // if (!name || !phone || !password) {
  //     //   console.error("필수 정보가 누락되었습니다.");
  //     //   return;
  //     // }
  //     // 회원가입 요청
  //     // await signup(signUpData, imagePreview);
  //     const signupResponse = await signup(signUpData, faceImage);

  //     if (signupResponse.status === "SUCCESS") {
  //       console.log("회원가입 성공");

  //       // 자동 로그인 요청
  //       const loginResponse = await login({ phone, password });
  //       // const loginResponse = await login({ phone, faceId: imagePreview });
  //       console.log('faceRecStep 자동로그인: ',loginResponse);

  //       if (loginResponse.status === "SUCCESS") {
  //         // 토큰 저장은 login 함수 내에서 처리
  //         onComplete(); // 회원가입 완료 처리
  //       } else {
  //         console.error("자동 로그인 실패");
  //       }
  //     } else {
  //       console.error("signup failed");
  //     }
  //   } catch (error) {
  //     console.error("Signup or login failed:", error);
  //   }
  // };
// 오디오말하기
const audio = new Audio(FaceRecAudio);

// 오디오 플레이 (component가 mount될때만)
useEffect(() => {
  // 플레이시켜
  audio.play();

  // 근데 component가 unmount 되면 플레이 중지! 시간 0초로 다시 되돌려
  return () => {
    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
  };
}, []);

  return (
    <>
      <GreenText text="얼굴 인식" boldChars={["얼굴 인식"]} />
      <GreenText text="눈, 코, 입을" boldChars={["눈, 코, 입"]} />
      <GreenText text="화면에 맞춰주세요" boldChars={["화면"]} />
      {imagePreview && (
        <img src={imagePreview} alt="Face Preview" className="face-preview" />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        ref={fileInputRef}
        capture="user"
      />
      <YellowButton height={50} width={200} onClick={openCamera}>
        사진 찍기
      </YellowButton>
      {/* <YellowButton height={50} width={200} onClick={onComplete}> */}
      <YellowButton height={50} width={200} onClick={onComplete}>
        다음
      </YellowButton>
    </>
  );
};

export default FaceRecognitionStep;
