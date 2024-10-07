// src/components/signup/UserNameStep.tsx
import React, { useEffect } from 'react';
import GreenText from "../../../components/GreenText";
import SayName from "../../../assets/audio/56_이름을_말하거나_입력해주세요.mp3"
import useUserStore from '../useUserStore';

// interface UserNameStepProps {
//   name: string;
//   setName: (name: string) => void;
//   onNext: () => void;
// }

const UserNameStep: React.FC = () => {
  const { name,setName, error } = useUserStore();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  // 오디오말하기
  const audio = new Audio(SayName);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    // 플레이시켜
    audio.play();

    // 근데 component가 unmount 되면 플레이 중지! 시간 0초로 다시 되돌려
    return () => {
        audio.pause();
        audio.currentTime = 0;
    };
  }, []);

  return (
    <>
    {/* 아무것도 입력안하고 넘어가려고 하면 에러페이지 띄움 */}
    {error && (
        <p className="mt-4 text-center text-[25px] font-bold text-red-500">
          {error}
        </p>
      )}
      <GreenText text="이름을 알려주세요." boldChars={["이름"]} />
      <input
        type="text"
        value={name}
        onChange={handleInputChange}
        // onChange={(e) => setName(e.target.value)}
        className="input-field"
      />
    </>
  );
};

export default UserNameStep;