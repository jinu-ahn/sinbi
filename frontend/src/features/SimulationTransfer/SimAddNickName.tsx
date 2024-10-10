import React, { useEffect } from "react";
import { useSimTransferStore } from "./SimTransferStore";
import { useAudioSTTControlStore } from "../../store/AudioSTTControlStore";
import BlackText from "../../components/BlackText";
import YellowBox from "../../components/YellowBox";
import bankLogos from "../../assets/bankLogos";
import defaultBankLogo from "../../assets/defaultBankLogo.png";
import SpeechBubble from "../../components/SpeechBubble";

import whatNickname from "../../assets/audio/29_무슨_이름으로_기억할까요.mp3";
import sayMyName from "../../assets/audio/75_은행_비서_라고_말해주세요.mp3";
import sayNext from "../../assets/audio/64_다_적었으면_'다음'이라고_말해주세요.mp3";

const SimAddNickName: React.FC = () => {
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

  const bubbleText = '"은행 비서"\n라고\n말해주세요.';
  const bubbleBoldChars = ["은행 비서", "말"];

  const { nickName, setNickName, formalName, sendBankType, sendAccountNum } =
    useSimTransferStore();

  const { setIsAudioPlaying } = useAudioSTTControlStore();

  const selectedBank = banks.find((bank) => bank.id === sendBankType) || {
    id: "BASIC",
    name: "기본은행",
    logo: defaultBankLogo,
  };

  const boldChars = [`${formalName}`];
  const text = `${formalName} 님을 어떻게 부를까요?`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickName(e.target.value);
  };

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    setIsAudioPlaying(true)
    const whatNicknameAudio = new Audio(whatNickname);
    const sayMyNameAudio = new Audio(sayMyName);
    const sayNextAudio = new Audio(sayNext);

    // whatNicknameAudio 먼저 플레이
    whatNicknameAudio.play();

    // whatNicknameAudio 다음에 sayMyNameAudio
    whatNicknameAudio.addEventListener("ended", () => {
      sayMyNameAudio.play();
    });

    // sayMyNameAudio 다음에 sayNextAudio
    sayMyNameAudio.addEventListener("ended", () => {
      sayNextAudio.play();
    });

    sayNextAudio.addEventListener("ended", () => {
      setIsAudioPlaying(false)
    })

    // unmount될때 다 초기화
    return () => {
      setIsAudioPlaying(true)
      whatNicknameAudio.pause();
      whatNicknameAudio.currentTime = 0;
      sayMyNameAudio.pause();
      sayMyNameAudio.currentTime = 0;
      sayNextAudio.pause();
      sayNextAudio.currentTime = 0;
    };
  }, []);

  return (
    <div className="mt-[20px]">
      <header>
        <BlackText
          textSize="text-[30px]"
          text={text}
          boldChars={boldChars}
        ></BlackText>
      </header>

      <div className="mt-[10px] flex items-center justify-center">
        <YellowBox>
          <input
            type="text"
            value={nickName}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-gray-300 p-2 text-[35px]"
          />

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

      <div className="mt-2 flex w-full justify-center">
        <SpeechBubble text={bubbleText} boldChars={bubbleBoldChars} />
      </div>
    </div>
  );
};

export default SimAddNickName;
