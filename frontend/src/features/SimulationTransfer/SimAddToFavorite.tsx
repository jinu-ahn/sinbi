import React, { useEffect } from "react";
import { useSimTransferStore } from "./SimTransferStore";
import BlackText from "../../components/BlackText";
import YellowBox from "../../components/YellowBox";
import bankLogos from "../../assets/bankLogos";
import defaultBankLogo from "../../assets/defaultBankLogo.png";
import SpeechBubble from "../../components/SpeechBubble";

import addMeToFavorite from "../../assets/audio/74_저를_자주_보낼_계좌_목록에_추가해볼까요_응_이라_말해주세요.mp3";

const SimAddToFavorite: React.FC = () => {
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

  const { formalName, sendAccountNum, sendBankType } = useSimTransferStore();

  const selectedBank = banks.find((bank) => bank.id === sendBankType) || {
    id: "BASIC",
    name: "신비은행",
    logo: defaultBankLogo,
  };

  const boldChars = ["또"];
  const text = `다음에도 또 보낼래요?`;

  const bubbleText = '"응"이라고\n말해주세요.'
  const bubbleBoldChars = ["응", "말"]


  // 오디오말하기
  const audio = new Audio(addMeToFavorite);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    // 플레이시켜
    audio.play();

    // 근데 component가 unmount 되면 플레이 중지! 시간 0초로 다시 되돌려
    return () => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className="mt-[30px]">
      <header>
        <BlackText
          textSize="text-[30px]"
          text={text}
          boldChars={boldChars}
        ></BlackText>
      </header>
      <div className="mt-[40px] flex items-center justify-center">
        <YellowBox>
          <p className="text-[30px] font-bold">{formalName}</p>
          <div className="m-2 flex">
            <img
              src={selectedBank.logo}
              alt={selectedBank.name}
              className="h-6 w-6"
            />
            <p>{selectedBank.name}</p>
          </div>
          <p className="text-[30px]">{sendAccountNum}</p>
        </YellowBox>
      </div>

      <div className="mt-8 flex w-full justify-center">
        <SpeechBubble text={bubbleText} boldChars={bubbleBoldChars} />
      </div>
    </div>
  );
};

export default SimAddToFavorite;
