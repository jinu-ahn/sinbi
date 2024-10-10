import React, { useEffect } from "react";
import { useTransferStore } from "./TransferStore";
import { useAudioSTTControlStore } from "../../store/AudioSTTControlStore";
import BlackText from "../../components/BlackText";
import YellowBox from "../../components/YellowBox";
import moneySent from "../../assets/audio/33_성공적으로_돈을_보냈어요.mp3";
import sayNext from "../../assets/audio/06_다음으로_넘어가려면_다음이라고_말해주세요.mp3";

const TransferCheck: React.FC = () => {
  const { formalName, money } = useTransferStore();
  const { setIsAudioPlaying } = useAudioSTTControlStore();
  const boldChars = [`${formalName}`, `${money}`, "원"];
  const text = `${formalName} 님에게 ${money} 원 보냈어요!`;

  // 오디오말하기
  const moneySentAskAudio = new Audio(moneySent);
  const sayNextNoAudio = new Audio(sayNext);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    setIsAudioPlaying(true);
    // moneySentAskAudio 먼저 플레이해
    moneySentAskAudio.play();

    // 돈 보낼까요 메시지 먼저 말하고 끝나면 그 다음거 해
    moneySentAskAudio.addEventListener("ended", () => {
      sayNextNoAudio.play();
    });

    sayNextNoAudio.addEventListener("ended", () => {
      setIsAudioPlaying(false);
    });

    // component unmount되면 중지시키고 둘다 0으로 되돌려
    return () => {
      setIsAudioPlaying(false);
      moneySentAskAudio.pause();
      moneySentAskAudio.currentTime = 0;

      sayNextNoAudio.pause();
      sayNextNoAudio.currentTime = 0;
    };
  }, []);

  return (
    <div className="mt-[80px] flex items-center justify-center">
      <YellowBox>
        <BlackText
          textSize="text-[30px]"
          text={text}
          boldChars={boldChars}
        ></BlackText>
      </YellowBox>
    </div>
  );
};

export default TransferCheck;
