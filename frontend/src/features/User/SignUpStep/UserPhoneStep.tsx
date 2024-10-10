// src/components/signup/UserPhoneStep.tsx
import React, { useEffect } from "react";
import GreenText from "../../../components/GreenText";
import SayPhoneNum from "../../../assets/audio/50_전화번호를_말하거나_입력해주세요.mp3";
import useUserStore from "../useUserStore";
import { useAudioSTTControlStore } from "../../../store/AudioSTTControlStore";
import DeleteOne from "../../../assets/audio/71_잘못_적었어도_걱정하지_마세요_'하나_지워'_'다_지워'_설명.mp3";
// interface UserPhoneStepProps {
//   phone: string;
//   setPhone: (name: string) => void;
//   onSendSms: () => Promise<void>;
// }

const UserPhoneStep: React.FC = () => {
  const { setIsAudioPlaying } = useAudioSTTControlStore();
  const { phone, setPhone } = useUserStore();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };
  // 오디오말하기
  const sayPhoneAudio = new Audio(SayPhoneNum);
  const delOneAudio = new Audio(DeleteOne);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    console.log("Setting IsAudioPlaying to true");
    setIsAudioPlaying(true);
    console.log("Finished set IsAudioPlaying to true");
    // 플레이시켜
    sayPhoneAudio.play();

    sayPhoneAudio.addEventListener("ended", () => {
      delOneAudio.play();
    });

    delOneAudio.addEventListener("ended", () => {
      setIsAudioPlaying(false);
    });

    // 근데 component가 unmount 되면 플레이 중지! 시간 0초로 다시 되돌려
    return () => {
      sayPhoneAudio.pause();
      sayPhoneAudio.currentTime = 0;

      delOneAudio.pause();
      delOneAudio.currentTime = 0;

      console.log("Setting IsAudioPlaying to true when Unmount");
      setIsAudioPlaying(true);
      console.log("Finished setting IsAudioPlayed to true when Unmount");
    };
  }, []);

  return (
    <>
      <GreenText text="전화번호를" boldChars={["전화번호"]} />
      <GreenText text="알려주세요" boldChars={[""]} />
      <input
        type="tel"
        value={phone}
        onChange={handleInputChange}
        // onChange={(e) => setPhone(e.target.value)}
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
