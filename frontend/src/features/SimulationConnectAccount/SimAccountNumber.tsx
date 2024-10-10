import React, { useEffect } from "react";
import YellowBox from "../../components/YellowBox";
import { useSimConnectAccountStore } from "./SimConnectAccountStore";
import { useAudioSTTControlStore } from "../../store/AudioSTTControlStore";

import SpeechBubble from "../../components/SpeechBubble";

import sayAccountNumber from "../../assets/audio/12_계좌번호를_말하거나_입력해주세요.mp3";
import deleteAll from "../../assets/audio/09_다_지워라고_말하면_전부_지울_수_있어요.mp3";
import sayNext from "../../assets/audio/06_다음으로_넘어가려면_다음이라고_말해주세요.mp3";

const SimAccountNumber: React.FC = () => {
  const { accountNum, setAccountNum, error, setError } =
    useSimConnectAccountStore();
  const { setIsAudioPlaying } = useAudioSTTControlStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountNum(e.target.value);
    setError(null);
  };

  const text = '계좌번호를\n말해주세요. 끝나셨으면\n"다음"이라고\n말해주세요.';
  const boldChars = ["계좌번호", "말", "다음"];

  // 오디오말하기
  const sayAccountNumberAudio = new Audio(sayAccountNumber);
  const deleteAllAudio = new Audio(deleteAll);
  const sayNextAudio = new Audio(sayNext);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    setIsAudioPlaying(true)
    // sayAccountNumberAudio 먼저 플레이
    sayAccountNumberAudio.play();

    // sayAccountNumberAudio 다음에 deleteAllAudio
    sayAccountNumberAudio.addEventListener("ended", () => {
      deleteAllAudio.play();
    });

    // deleteAllAudio 다음에 sayNextAudio
    deleteAllAudio.addEventListener("ended", () => {
      sayNextAudio.play();
    });

    sayNextAudio.addEventListener("ended", () => {
      setIsAudioPlaying(false)
    })

    // unmount될때 다 초기화
    return () => {
      setIsAudioPlaying(false)
      sayAccountNumberAudio.pause();
      sayAccountNumberAudio.currentTime = 0;
      deleteAllAudio.pause();
      deleteAllAudio.currentTime = 0;
      sayNextAudio.pause();
      sayNextAudio.currentTime = 0;
    };
  }, []);

  return (
    <div>
      <header>
        <h1 className="text-center text-[40px]">통장 등록</h1>
      </header>

      {/* 아무것도 입력안하고 넘어가려고 하면 에러페이지 띄움 */}
      {error && (
        <p className="mt-4 text-center text-[25px] font-bold text-red-500">
          {error}
        </p>
      )}

      <div className="flex w-full justify-center">
        <YellowBox>
          <div>
            <p className="mb-[20px] text-[30px] font-bold">계좌번호</p>
          </div>
          <div>
            <input
              type="number"
              value={accountNum}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 p-2 text-[35px]"
            />
          </div>
        </YellowBox>
      </div>

      <div className="mt-8 flex w-full justify-center">
        <SpeechBubble text={text} boldChars={boldChars} />
      </div>
    </div>
  );
};

export default SimAccountNumber;
