import React, { useEffect } from "react";
import YellowBox from "../../components/YellowBox";
import { useSimConnectAccountStore } from "./SimConnectAccountStore";
import bankLogos from "../../assets/bankLogos";
import defaultBankLogo from "../../assets/defaultBankLogo.png";
import SpeechBubble from "../../components/SpeechBubble";

import isThisAccountRight from "../../assets/audio/15_이_계좌가_맞나요.mp3";
import sayYes from "../../assets/audio/62_맞으면_'맞아'_틀리면_'아니'라고_말해주세요.mp3";
import anErrorOccurred from "../../assets/audio/14_해당하는_계좌가_없어요_다시_한번_확인해주세요.mp3";
import goBack from "../../assets/audio/05_뒤로_가려면_이전이라고_말해주세요.mp3";

const SimAccountCheck: React.FC = () => {
  const { bankType, accountNum, error } = useSimConnectAccountStore();
  const banks = [
    { id: "IBK", name: "IBK기업은행", logo: bankLogos["IBK기업은행"] },
    { id: "KB", name: "국민은행", logo: bankLogos["KB국민은행"] },
    { id: "KDB", name: "KDB산업은행", logo: bankLogos["KDB산업은행"] },
    { id: "KEB", name: "KEB외환은행", logo: bankLogos["KEB외환은행"] },
    { id: "NH", name: "NH농협은행", logo: bankLogos["NH농협은행"] },
    { id: "SBI", name: "SBI저축은행", logo: bankLogos["SBI저축은행"] },
    { id: "SC", name: "SC제일은행", logo: bankLogos["SC제일은행"] },
    { id: "KYUNGNAM", name: "경남은행", logo: bankLogos["경남은행"] },
    { id: "GWANJU", name: "광주은행", logo: bankLogos["광주은행"] },
    { id: "DAEGU", name: "대구은행", logo: bankLogos["대구은행"] },
    { id: "BUSAN", name: "부산은행", logo: bankLogos["부산은행"] },
    { id: "SANLIM", name: "산림조합", logo: bankLogos["산림조합"] },
    { id: "SAEMAEUL", name: "새마을은행", logo: bankLogos["새마을은행"] },
    { id: "SUHYUB", name: "수협은행", logo: bankLogos["수협은행"] },
    { id: "SHINHAN", name: "신한은행", logo: bankLogos["신한은행"] },
    { id: "SHINHYUB", name: "신협은행", logo: bankLogos["신협은행"] },
    { id: "CITY", name: "씨티은행", logo: bankLogos["씨티은행"] },
    { id: "WOORI", name: "우리은행", logo: bankLogos["우리은행"] },
    { id: "POSTBANK", name: "우체국은행", logo: bankLogos["우체국은행"] },
    { id: "JYOCHUK", name: "저축은행", logo: bankLogos["저축은행"] },
    { id: "JYUNBUK", name: "전북은행", logo: bankLogos["전북은행"] },
    { id: "JEJU", name: "제주은행", logo: bankLogos["제주은행"] },
    { id: "KAKAO", name: "카카오뱅크", logo: bankLogos["카카오뱅크"] },
    { id: "TOSS", name: "토스뱅크", logo: bankLogos["토스뱅크"] },
    { id: "HANA", name: "하나은행", logo: bankLogos["하나은행"] },
    { id: "HANKUKTUZA", name: "한국투자증권", logo: bankLogos["한국투자증권"] },
  ];

  const selectedBank = banks.find((bank) => bank.id === bankType) || {
    id: "BASIC",
    name: "기본은행",
    logo: defaultBankLogo,
  };

  const text = error
    ? '계좌가 없어요.\n뒤로 가려면\n"이전"이라고\n말해주세요.'
    : '계좌가 맞나요?\n"맞아" 혹은\n"아니"로\n대답해주세요.';
  const boldChars = ["맞아", "아니", "이전", "없어요"];

  // 오디오말하기
  const isThisAccountRightAudio = new Audio(isThisAccountRight);
  const sayYesAudio = new Audio(sayYes);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    if (!error) {
      // sendMoneyAskAudio 먼저 플레이해
      isThisAccountRightAudio.play();

      // 돈 보낼까요 메시지 먼저 말하고 끝나면 그 다음거 해
      isThisAccountRightAudio.addEventListener("ended", () => {
        sayYesAudio.play();
      });
    }

    // component unmount되면 중지시키고 둘다 0으로 되돌려
    return () => {
      isThisAccountRightAudio.pause();
      isThisAccountRightAudio.currentTime = 0;

      sayYesAudio.pause();
      sayYesAudio.currentTime = 0;
    };
  }, [error]);

  // 에러났으면 플레이할 오디오
  useEffect(() => {
    if (error) {
      const errorAudio = new Audio(anErrorOccurred);
      const backAudio = new Audio(goBack);

      errorAudio.play();

      errorAudio.addEventListener("ended", handleErrorAudioEnded);

      function handleErrorAudioEnded() {
        backAudio.play();
      }

      // 근데 component가 unmount 되면 플레이 중지! 시간 0초로 다시 되돌려
      return () => {
        errorAudio.removeEventListener("ended", handleErrorAudioEnded);

        if (!errorAudio.paused) {
          errorAudio.pause();
          errorAudio.currentTime = 0;
        }
        if (!backAudio.paused) {
          backAudio.pause();
          backAudio.currentTime = 0;
        }
      };
    }
  }, [error]);

  return (
    <div>
      <header>
        <h1 className="text-center text-[40px]">통장 확인</h1>
      </header>

      {/* 아무것도 입력안하고 넘어가려고 하면 에러페이지 띄움 */}
      {error && (
        <p className="mt-4 text-center text-[25px] font-bold text-red-500">
          {error}
        </p>
      )}

      <div className="mt-4 flex w-[350px] justify-center">
        <YellowBox>
          {/* 은행 로고와 이름 */}
          <div className="flex items-center space-x-4">
            {selectedBank && (
              <>
                <img
                  src={selectedBank.logo}
                  alt={selectedBank.name}
                  className="h-10 w-10"
                />
                <p className="text-[30px] font-bold">{selectedBank.name}</p>
              </>
            )}
          </div>

          {/* 계좌번호 */}
          <div>
            <p className="text-[30px] font-bold">{accountNum}</p>
          </div>
        </YellowBox>
      </div>

      <div className="mt-8 flex w-full justify-center">
        <SpeechBubble text={text} boldChars={boldChars} />
      </div>
    </div>
  );
};

export default SimAccountCheck;
