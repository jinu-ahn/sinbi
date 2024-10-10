// src/components/User/SignUpStep/FaceRecognitionCompleteStep.tsx
import React, { useEffect } from 'react';
import GreenText from "../../../components/GreenText";
import { useNavigate } from 'react-router-dom';
// import useUserStore from '../useUserStore';

// interface FaceRecognitionCompleteStepProps {
//   onComplete: () => void;
// }


const FaceRecognitionCompleteStep: React.FC = () => {
  // const {nextStep} = useUserStore()
  const navigate = useNavigate();

  useEffect(() => {
    // 2초 후에 '/sim'으로 이동
    const timer = setTimeout(() => {
      navigate('/sim');
    }, 2000);

    // 컴포넌트가 언마운트되면 타이머를 정리
    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <>
      <GreenText text="얼굴 인식이 완료되었습니다." boldChars={["완료"]} />
      {/* <YellowButton height={50} width={200} onClick={onComplete}>
        회원가입 완료
      </YellowButton> */}
    </>
  );
};

export default FaceRecognitionCompleteStep;