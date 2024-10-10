import React, { useState, useRef } from 'react';
import { login } from '../../../services/api';
import GreenText from '../../../components/GreenText';
import YellowButton from '../../../components/YellowButton';

interface FaceRecognitionLoginProps {
  phone: string;
  onSuccess: () => void;
  onFailure: () => void;
}

const FaceRecognitionLogin: React.FC<FaceRecognitionLoginProps> = ({ phone, onSuccess, onFailure }) => {
  const [faceImage, setFaceImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFaceImage(e.target.files[0]);
    }
  };

  const handleFaceLogin = async () => {
    if (!faceImage) {
      console.error("얼굴 이미지가 없습니다.");
      return;
    }

    try {
      const response = await login({ phone }, faceImage);
      if (response.status === "SUCCESS") {
        onSuccess();
      } else {
        onFailure();
      }
    } catch (error) {
      console.error("Face login failed:", error);
      onFailure();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <GreenText text="눈, 코, 입을" boldChars={["눈", "코", "입"]} />
      <GreenText text="화면에 맞춰주세요" boldChars={["화면"]} />
      <input
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleImageCapture}
        ref={fileInputRef}
        className="hidden"
      />
      <YellowButton height={50} width={200} onClick={() => fileInputRef.current?.click()}>
        사진 찍기
      </YellowButton>
      {faceImage && (
        <YellowButton height={50} width={200} onClick={handleFaceLogin}>
          얼굴로 로그인
        </YellowButton>
      )}
    </div>
  );
};

export default FaceRecognitionLogin;