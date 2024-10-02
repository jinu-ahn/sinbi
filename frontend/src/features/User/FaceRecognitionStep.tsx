// FaceRecognitionStep.tsx
import React, { useRef, useState } from "react";
import GreenText from "../../components/GreenText";
import YellowButton from "../../components/YellowButton";
import useUserStore from "./useUserStore";
import { tokenStorage } from "./tokenUtils"; // 토큰 저장소 import
import { signup, login } from "../../services/api"; // API 함수 import

interface FaceRecognitionStepProps {
  onComplete: () => void;
}

const FaceRecognitionStep: React.FC<FaceRecognitionStepProps> = ({
  onComplete,
}) => {
  const { setFaceImage, name, phone, password } = useUserStore();
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

  // What: 회원가입 및 로그인 처리
  // Why: 얼굴 인식 정보를 포함하여 회원가입을 완료하고 자동 로그인
  const handleSignUpAndLogin = async () => {
    try {
      const signUpData = {
        userName: name,
        userPhone: phone,
        userPassword: password,
      };

      // 회원가입 요청
      await signup(signUpData, imagePreview);

      // 자동 로그인 요청
      const loginResponse = await login({ phone, faceId: imagePreview });

      if (loginResponse.status === "SUCCESS") {
        // 토큰 저장
        if (loginResponse.accessToken) {
          tokenStorage.setAccessToken(loginResponse.accessToken);
        }
        if (loginResponse.refreshToken) {
          tokenStorage.setRefreshToken(loginResponse.refreshToken);
        }
        onComplete(); // 회원가입 완료 처리
      } else {
        console.error("Login failed after signup");
      }
    } catch (error) {
      console.error("Signup or login failed:", error);
    }
  };

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
      <YellowButton height={50} width={200} onClick={handleSignUpAndLogin}>
        회원가입 완료
      </YellowButton>
    </>
  );
};

export default FaceRecognitionStep;
