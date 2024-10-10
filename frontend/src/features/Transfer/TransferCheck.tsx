import React, { useEffect } from "react";
import { useTransferStore } from "./TransferStore";
import { useAudioSTTControlStore } from "../../store/AudioSTTControlStore";
import BlackText from "../../components/BlackText";
import YellowBox from "../../components/YellowBox";
import sayYesOrNo from "../../assets/audio/08_좋으면_응_싫으면_아니_라고_말해주세요.mp3";
import sendMoneyAsk from "../../assets/audio/60_돈을_보낼까요.mp3";

const TransferCheck: React.FC = () => {
  const { formalName, money } = useTransferStore();
  const boldChars = [`${formalName}`, `${money}`, "원"];
  const text = `${formalName} 님에게 ${money} 원 보낼까요?`;
  const { setIsAudioPlaying } = useAudioSTTControlStore();

  // 오디오말하기
  const sendMoneyAskAudio = new Audio(sendMoneyAsk);
  const yesOrNoAudio = new Audio(sayYesOrNo);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    setIsAudioPlaying(true);
    // sendMoneyAskAudio 먼저 플레이해
    sendMoneyAskAudio.play();

    // 돈 보낼까요 메시지 먼저 말하고 끝나면 그 다음거 해
    sendMoneyAskAudio.addEventListener("ended", () => {
      yesOrNoAudio.play();
    });

    yesOrNoAudio.addEventListener("ended", () => {
      setIsAudioPlaying(false);
    });

    // component unmount되면 중지시키고 둘다 0으로 되돌려
    return () => {
      setIsAudioPlaying(true);
      sendMoneyAskAudio.pause();
      sendMoneyAskAudio.currentTime = 0;

      yesOrNoAudio.pause();
      yesOrNoAudio.currentTime = 0;
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
