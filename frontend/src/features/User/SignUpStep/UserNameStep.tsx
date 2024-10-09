// src/components/signup/UserNameStep.tsx
import React, { useEffect } from "react";
import GreenText from "../../../components/GreenText";
import SayName from "../../../assets/audio/56_이름을_말하거나_입력해주세요.mp3";
import DeleteAll from "../../../assets/audio/09_다_지워라고_말하면_전부_지울_수_있어요.mp3";
import SayNext from "../../../assets/audio/06_다음으로_넘어가려면_다음이라고_말해주세요.mp3";
import useUserStore from "../useUserStore";

const UserNameStep: React.FC = () => {
  const { name, setName, error, setIsAudioPlaying } = useUserStore();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  // 오디오말하기
  const sayNameAudio = new Audio(SayName);
  const deleteAllAudio = new Audio(DeleteAll);
  const sayNextAudio = new Audio(SayNext);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    setIsAudioPlaying(true);
    // 먼저플레이
    sayNameAudio.play();
    // 먼저 말하고 끝나면 그 다음거
    sayNameAudio.addEventListener("ended", () => {
      deleteAllAudio.play();
    });
    deleteAllAudio.addEventListener("ended", () => {
      sayNextAudio.play();
      // setIsAudioPlaying(false)
    });
    sayNextAudio.addEventListener("ended", () => {
      setIsAudioPlaying(false);
    });

    // 근데 component가 unmount 되면 플레이 중지! 시간 0초로 다시 되돌려
    return () => {
      // setIsAudioPlaying(false)

      sayNameAudio.pause();
      sayNameAudio.currentTime = 0;

      deleteAllAudio.pause();
      deleteAllAudio.currentTime = 0;

      sayNextAudio.pause();
      sayNextAudio.currentTime = 0;

      setIsAudioPlaying(true);
      console.log("namestep에서 true로 해놓고 unmount한다!")
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
