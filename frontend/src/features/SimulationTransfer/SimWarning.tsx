import React, { useEffect } from "react";
import SpeechBubble from "../../components/SpeechBubble";

import warningVoice from "../../assets/audio/35_모르는_사람에게_돈_보내면_위험해요.mp3";
import continueOrNot from "../../assets/audio/59_계속하고_싶으면_'알았어'_뒤로_가고_싶으면_'이전'이라고_말해주세요.mp3";

const SimWarning: React.FC = () => {
  const boldChars = ["모르는 사람", "위험"];
  const text = "모르는 사람에게 돈 보내면 위험해요!";

  const renderTextWithBold = () => {
    const regex = new RegExp(`(${boldChars.join("|")})`, "g");
    // 만약 볼드로 만들고싶은게 "처음", "비서"면
    // 최종적으로 regex = /(처음|비서)/g
    // g는 global (전체적으로 matching 하는 단어를 전부 찾음)

    // 볼드체가 되어야하는 단어들 기준으로 나눠
    const parts = text.split(regex);

    return parts.map((part, index) => {
      // 돌면서 bold인 애들 matching 하면 bold로 바꿈
      if (boldChars.includes(part)) {
        return (
          <span key={index} className="font-bold text-[#ff0f0f]">
            {part}
          </span>
        );
      }
      // bold로 바꿔야하는 애들이 아니면 className 적용x
      return (
        <span key={index} className="text-[#ff0f0f]">
          {part}
        </span>
      );
    });
  };

  // 오디오말하기
  const warningAudio = new Audio(warningVoice);
  const continueAudio = new Audio(continueOrNot);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    // warningaudio 먼저 플레이해
    warningAudio.play();

    // 경고 메시지 먼저 말하고 끝나면 그 다음거 해
    warningAudio.addEventListener("ended", () => {
      continueAudio.play();
    });

    // component unmount되면 중지시키고 둘다 0으로 되돌려
    return () => {
      warningAudio.pause();
      warningAudio.currentTime = 0;

      continueAudio.pause();
      continueAudio.currentTime = 0;
    };
  }, []);

  const bubbleText = '"알았어" 라고 말해주세요.';
  const bubbleBoldChars = ["알았어", "말"];

  return (
    <div className="flex flex-col items-center">
      <div className="mt-[100px] flex h-1/4 w-4/5 max-w-[500px] items-center justify-center border-2 border-[#ff0f0f]">
        <div className="text-center text-[36px] leading-relaxed">
          {renderTextWithBold()}
        </div>
      </div>

      <div className="mt-[150px] flex w-full justify-center">
        <SpeechBubble text={bubbleText} boldChars={bubbleBoldChars} />
      </div>
    </div>
  );
};

export default SimWarning;
