// src/components/User/SignUpStep/SignUpCompleteStep.tsx
import React, { useEffect } from "react";
import { useAudioSTTControlStore } from "../../../store/AudioSTTControlStore";
import GreenText from "../../../components/GreenText";
import SignUpFin from "../../../assets/audio/07_완료되었어요_시작화면으로_이동할게요.mp3";

const SignUpCompleteStep: React.FC = () => {
  const { setIsAudioPlaying } = useAudioSTTControlStore();
  // 오디오말하기
  const audio = new Audio(SignUpFin);

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
      <GreenText text="회원가입 끝!" boldChars={["끝"]} />
      <GreenText text="첫 화면으로" boldChars={["첫 화면"]} />
      <GreenText text="갈게요" boldChars={[""]} />
    </>
  );
};

export default SignUpCompleteStep;
