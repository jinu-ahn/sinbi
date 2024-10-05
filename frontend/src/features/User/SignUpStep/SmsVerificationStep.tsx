// src/components/User/SignUpStep/SmsVerificationStep.tsx
import React, { useEffect } from "react";
import GreenText from "../../../components/GreenText";
import YellowButton from "../../../components/YellowButton";
import NumberPad from "../NumberPad";
import VerifyAudio from "../../../assets/audio/57_인증번호가_안_나오면_문자를_보고_알려주세요.mp3";

interface SmsVerificationStepProps {
  smsCode: string;
  setSmsCode: (code: string) => void;
  onVerifySms: () => Promise<void>;
}

const SmsVerificationStep: React.FC<SmsVerificationStepProps> = ({
  smsCode,
  setSmsCode,
  onVerifySms,
}) => {
  // 오디오말하기
  const audio = new Audio(VerifyAudio);

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
      <GreenText text="인증번호가" boldChars={["인증번호"]} />
      <GreenText text="안 나오면," boldChars={[]} />
      <GreenText text="문자를 보고" boldChars={["문자"]} />
      <GreenText text="알려주세요" boldChars={[]} />
      <NumberPad value={smsCode} onChange={setSmsCode} maxLength={4} />
      <YellowButton height={50} width={200} onClick={onVerifySms}>
        인증하기
      </YellowButton>
    </>
  );
};

export default SmsVerificationStep;
