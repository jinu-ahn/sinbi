import React, { useEffect } from "react";
import GreenText from "../../../components/GreenText";
import YellowButton from "../../../components/YellowButton";

import SayPhone from "../../../assets/audio/50_전화번호를_말하거나_입력해주세요.mp3";

interface PhoneStepProps {
  phone: string;
  setPhone: (phone: string) => void;
  onSubmit: () => void;
}

const PhoneStep: React.FC<PhoneStepProps> = ({ phone, setPhone, onSubmit }) => {
  // 오디오말하기
  const audio = new Audio(SayPhone);

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
      <GreenText text="전화번호를" boldChars={["전화번호"]} />
      <GreenText text="알려주세요" boldChars={[""]} />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="input-field"
        placeholder="전화번호"
      />
      <YellowButton height={50} width={200} onClick={onSubmit}>
        다음
      </YellowButton>
    </>
  );
};

export default PhoneStep;
