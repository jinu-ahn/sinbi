import React, { useEffect } from "react";
import YellowBox from "../../components/YellowBox";
import { useSimTransferStore } from "./SimTransferStore";
import { useAudioSTTControlStore } from "../../store/AudioSTTControlStore";
import SpeechBubble from "../../components/SpeechBubble";

import sendMeMoney from "../../assets/audio/73_저한테_돈을_보내봐요_오천원이라고_말해볼까요.mp3";
import sayNext from "../../assets/audio/64_다_적었으면_'다음'이라고_말해주세요.mp3";

const SimRecvAmount: React.FC = () => {
  const {
    money,
    setSendMoney,
    error,
    setError,
    formalName,
    favAccountId,
    sendAccountNum,
  } = useSimTransferStore();
  const { setIsAudioPlaying } = useAudioSTTControlStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSendMoney(e.target.value);
    setError(null);
  };

  const text = '"5000원"\n이라고\n말해주세요.';
  const boldChars = ["5000원", "말"];

  useEffect(() => {
    console.log("favaccountid: ", favAccountId);
    console.log("sendAccountNum: ", sendAccountNum);
  }, [favAccountId, sendAccountNum]);

  // 오디오말하기
  const sendMeMoneyAudio = new Audio(sendMeMoney);
  const sayNextudio = new Audio(sayNext);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    setIsAudioPlaying(true)
    // sendMeMoneyAudio 먼저 플레이해
    sendMeMoneyAudio.play();

    // 돈 보낼까요 메시지 먼저 말하고 끝나면 그 다음거 해
    sendMeMoneyAudio.addEventListener("ended", () => {
      sayNextudio.play();
    });

    sayNextudio.addEventListener("ended", () => {
      setIsAudioPlaying(false)
    })

    // component unmount되면 중지시키고 둘다 0으로 되돌려
    return () => {
      setIsAudioPlaying(true)
      sendMeMoneyAudio.pause();
      sendMeMoneyAudio.currentTime = 0;

      sayNextudio.pause();
      sayNextudio.currentTime = 0;
    };
  }, []);

  return (
    <div>
      <header>
        <h1 className="text-center text-[40px]">돈 보내기</h1>
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
            <p className="mb-[20px] text-[30px] font-bold">
              {formalName} <span className="font-normal">님에게</span>
            </p>
          </div>
          <div className="flex items-center">
            <input
              type="number"
              value={money}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 p-2 text-[35px]"
            />
            <p className="text-[25px] font-bold">&nbsp;원</p>
          </div>
        </YellowBox>
      </div>

      <div className="mt-8 flex w-full justify-center">
        <SpeechBubble text={text} boldChars={boldChars} />
      </div>
    </div>
  );
};

export default SimRecvAmount;
