// src/components/User/SignUpStep/StartFaceRecognitionStep.tsx
import React, { useEffect } from "react";
import { useAudioSTTControlStore } from "../../../store/AudioSTTControlStore";
import GreenText from "../../../components/GreenText";
import FaceEasy from "../../../assets/audio/52_얼굴로_로그인하면_더_편해요_얼굴을_등록할까요.mp3";
// interface StartFaceRecognitionStepProps {
//   onStart: () => void;
// }

const StartFaceRecognitionStep: React.FC = () => {
  const { setIsAudioPlaying } = useAudioSTTControlStore();
  // const { nextStep } = useUserStore();
  // 오디오말하기
  const audio = new Audio(FaceEasy);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    setIsAudioPlaying(true);
    // 플레이시켜
    audio.play();
    audio.addEventListener("ended", () => {
      setIsAudioPlaying(false);
    });

    // 근데 component가 unmount 되면 플레이 중지! 시간 0초로 다시 되돌려
    return () => {
      setIsAudioPlaying(false);
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  return (
    <>
      <GreenText text="얼굴로 로그인하면" boldChars={["얼굴"]} />
      <GreenText text="더 편해요." boldChars={[""]} />
      <GreenText text="등록할까요?" boldChars={["등록"]} />
      {/* <YellowButton height={50} width={200} onClick={onStart}>
        시작
      </YellowButton> */}
    </>
  );
};

export default StartFaceRecognitionStep;
