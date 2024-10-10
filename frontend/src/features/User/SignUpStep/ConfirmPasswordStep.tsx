// src/components/User/SignUpStep/ConfirmPasswordStep.tsx
import React, { useEffect } from "react";
import { useAudioSTTControlStore } from "../../../store/AudioSTTControlStore";
import GreenText from "../../../components/GreenText";
import NumberPad from "../NumberPad";
import AgainTTS from "../../../assets/audio/04_다시_한_번_눌러주세요.mp3";
import useUserStore from "../useUserStore";
// interface ConfirmPasswordStepProps {
//   confirmPassword: string;
//   setConfirmPassword: (password: string) => void;
//   onConfirm: () => void;
// }

const ConfirmPasswordStep: React.FC = () => {
  const { confirmPassword, setConfirmPassword } = useUserStore();
  const { setIsAudioPlaying } = useAudioSTTControlStore();
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setConfirmPassword(e.target.value);
  // };

  // 오디오말하기
  const audio = new Audio(AgainTTS);

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

  const handleConfirmPasswordChange = (newPassword: string) => {
    setConfirmPassword(newPassword);
  };

  return (
    <>
      <GreenText text="다시 한 번" boldChars={["다시"]} />
      <GreenText text="눌러주세요." boldChars={["눌러주세요"]} />
      <NumberPad
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        maxLength={4}
      />
      {/* <YellowButton height={50} width={200} onClick={onConfirm}>
        다음
      </YellowButton> */}
    </>
  );
};

export default ConfirmPasswordStep;
