// src/components/signup/UserPhoneStep.tsx
import React, { useEffect } from 'react';
import GreenText from "../../../components/GreenText";
import YellowButton from "../../../components/YellowButton";
import SayPhoneNum from "../../../assets/audio/50_전화번호를_말하거나_입력해주세요.mp3"
import useUserStore from '../useUserStore';

// interface UserPhoneStepProps {
//   phone: string;
//   setPhone: (name: string) => void;
//   onSendSms: () => Promise<void>;
// }

const UserPhoneStep: React.FC = () => {
  const { phone } = useUserStore();

  // 오디오말하기
  const audio = new Audio(SayPhoneNum);

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
        // onChange={(e) => setPhone(e.target.value)}
        // readOnly
        className="input-field"
        pattern="^\d{2,3}\d{3,4}\d{4}$"
      />
      {/* <YellowButton height={50} width={200} onClick={onSendSms}>
        인증번호 받기
      </YellowButton> */}
    </>
  );
};

export default UserPhoneStep;