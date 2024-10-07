// src/components/User/SignUpStep/ConfirmPasswordStep.tsx
import React, { useEffect } from 'react';
import GreenText from "../../../components/GreenText";
import YellowButton from "../../../components/YellowButton";
import NumberPad from "../NumberPad";
import AgainTTS from "../../../assets/audio/04_다시_한_번_눌러주세요.mp3"
interface ConfirmPasswordStepProps {
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  onConfirm: () => void;
}

const ConfirmPasswordStep: React.FC<ConfirmPasswordStepProps> = ({ confirmPassword, setConfirmPassword, onConfirm }) => {
  // const {confirmPassword, setConfirmPassword} = useUserStore()
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setConfirmPassword(e.target.value);
  // };

  // 오디오말하기
  const audio = new Audio(AgainTTS);

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
      <GreenText text="다시 한 번" boldChars={["다시"]} />
      <GreenText text="눌러주세요." boldChars={["눌러주세요"]} />
      <NumberPad
        value={confirmPassword}
        onChange={setConfirmPassword}
        maxLength={4}
      />
      <YellowButton height={50} width={200} onClick={onConfirm}>
        다음
      </YellowButton>
    </>
  );
};

export default ConfirmPasswordStep;