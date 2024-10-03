import React, { useEffect } from "react";
import YellowBox from "../../components/YellowBox";
import { useConnectAccountStore } from "./ConnectAccountStore";

import sentVerificationCode from "../../assets/audio/16_인증번호를_보냈어요.mp3";
import sayVerificationCode from "../../assets/audio/57_인증번호가_안_나오면_문자를_보고_알려주세요.mp3";

const VerificationCode: React.FC = () => {
  const { verificationCode, setVerificationCode, error } =
    useConnectAccountStore();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
  };

  // 오디오말하기
  const sentVerificationCodeAudio = new Audio(sentVerificationCode);
  const sayVerificationCodeAudio = new Audio(sayVerificationCode);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    // sentVerificationCodeAudio 먼저 플레이해
    sentVerificationCodeAudio.play();

    // 돈 보낼까요 메시지 먼저 말하고 끝나면 그 다음거 해
    sentVerificationCodeAudio.addEventListener("ended", () => {
      sayVerificationCodeAudio.play();
    });

    // component unmount되면 중지시키고 둘다 0으로 되돌려
    return () => {
      sentVerificationCodeAudio.pause();
      sentVerificationCodeAudio.currentTime = 0;

      sayVerificationCodeAudio.pause();
      sayVerificationCodeAudio.currentTime = 0;
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
            <p className="mb-[20px] text-[30px] font-bold">인증번호</p>
          </div>
          <div>
            <input
              type="number"
              value={verificationCode}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 p-2 text-[35px]"
            />
          </div>
        </YellowBox>
      </div>
    </div>
  );
};

export default VerificationCode;
