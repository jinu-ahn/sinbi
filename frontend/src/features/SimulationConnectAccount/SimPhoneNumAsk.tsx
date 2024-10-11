import React, { useEffect } from "react";
import YellowBox from "../../components/YellowBox";
import { useSimConnectAccountStore } from "./SimConnectAccountStore";
import { useAudioSTTControlStore } from "../../store/AudioSTTControlStore";
import SpeechBubble from "../../components/SpeechBubble";

import sayPhoneNum from "../../assets/audio/50_전화번호를_말하거나_입력해주세요.mp3";
import sayNext from "../../assets/audio/64_다_적었으면_'다음'이라고_말해주세요.mp3";
import sendYouCode from "../../assets/audio/63_문자로_인증번호를_보내드릴게요.mp3";

const SimPhoneNumAsk: React.FC = () => {
  const { setIsAudioPlaying } = useAudioSTTControlStore();
  const { phoneNum, setPhoneNum, error } = useSimConnectAccountStore();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNum(e.target.value);
  };

  const text = "전화번호를\n말해주세요.";
  const boldChars = ["전화번호", "말"];

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    setIsAudioPlaying(true);
    const sayPhoneNumAudio = new Audio(sayPhoneNum);
    const sayNextAudio = new Audio(sayNext);
    const sendYouCodeAudio = new Audio(sendYouCode);

    // sayPhoneNumAudio 먼저 플레이
    sayPhoneNumAudio.play();

    // sayPhoneNumAudio 다음에 sayNextAudio
    sayPhoneNumAudio.addEventListener("ended", () => {
      sayNextAudio.play();
    });

    // sayNextAudio 다음에 sayNextAudio
    sayNextAudio.addEventListener("ended", () => {
      sendYouCodeAudio.play();
    });

    sendYouCodeAudio.addEventListener("ended", () => {
      setIsAudioPlaying(false);
    });

    // unmount될때 다 초기화
    return () => {
      setIsAudioPlaying(false);
      sayPhoneNumAudio.pause();
      sayPhoneNumAudio.currentTime = 0;
      sayNextAudio.pause();
      sayNextAudio.currentTime = 0;
      sendYouCodeAudio.pause();
      sendYouCodeAudio.currentTime = 0;
    };
  }, []);

  return (
    <div>
      <header>
        <h1 className="text-center text-[40px]">본인 인증</h1>
      </header>

      {/* 아무것도 입력안하고 넘어가려고 하면 에러페이지 띄움 */}
      {error && (
        <p className="mt-4 text-center text-[25px] font-bold text-red-500">
          {error}
        </p>
      )}

      <div className="mt-4 flex w-[350px] justify-center">
        <YellowBox>
          <div>
            <p className="mb-[20px] text-[30px] font-bold">전화번호</p>
          </div>
          <div>
            <input
              type="number"
              value={phoneNum}
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

export default SimPhoneNumAsk;
