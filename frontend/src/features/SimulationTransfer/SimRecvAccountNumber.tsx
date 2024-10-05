import React, { useEffect } from "react";
import YellowBox from "../../components/YellowBox";
import { useSimTransferStore } from "./SimTransferStore";
import SpeechBubble from "../../components/SpeechBubble";

import saySinbiAccountNum from "../../assets/audio/70_저에게_한번_돈을_보내볼까요_제_계좌번호는_구팔칠육오사삼이일이에요_따라_말하시면_돼요.mp3";
import howToDelete from "../../assets/audio/71_잘못_적었어도_걱정하지_마세요_'하나_지워'_'다_지워'_설명.mp3";
import sayNext from "../../assets/audio/64_다_적었으면_'다음'이라고_말해주세요.mp3";

const SimRecvAccountNumber: React.FC = () => {
  const { sendAccountNum, setSendAccountNum, error, setError } =
    useSimTransferStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSendAccountNum(e.target.value);
    setError(null);
  };

  // 말풍선 내용
  const text = '987654321\n말해보세요.\n지우고 싶을땐\n"하나 지워"\n"다 지워"';
  const boldChars = ["987654321", "말", "하나 지워", "다 지워"];

  // 오디오말하기
  const saySinbiAccountNumAudio = new Audio(saySinbiAccountNum);
  const howToDeleteAudio = new Audio(howToDelete);
  const sayNextAudio = new Audio(sayNext);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    // saySinbiAccountNumAudio 먼저 플레이해
    saySinbiAccountNumAudio.play();

    // 돈 보낼까요 메시지 먼저 말하고 끝나면 그 다음거 해
    saySinbiAccountNumAudio.addEventListener("ended", () => {
      howToDeleteAudio.play();

      howToDeleteAudio.addEventListener("ended", () => {
        setTimeout(() => {
          sayNextAudio.play();
        }, 1000);
      });
    });

    // component unmount되면 중지시키고 둘다 0으로 되돌려
    return () => {
      saySinbiAccountNumAudio.pause();
      saySinbiAccountNumAudio.currentTime = 0;

      howToDeleteAudio.pause();
      howToDeleteAudio.currentTime = 0;

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
              value={sendAccountNum}
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

export default SimRecvAccountNumber;
