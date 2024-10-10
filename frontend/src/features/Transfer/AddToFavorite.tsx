import React, { useEffect } from "react";
import { useTransferStore } from "./TransferStore";
import { useAudioSTTControlStore } from "../../store/AudioSTTControlStore";
import BlackText from "../../components/BlackText";
import YellowBox from "../../components/YellowBox";
import defaultBankLogo from "../../assets/defaultBankLogo.png";
import addToFavorite from "../../assets/audio/61_앞으로도_이분께_자주_보내실_건가요.mp3";
import sayYesOrNo from "../../assets/audio/08_좋으면_응_싫으면_아니_라고_말해주세요.mp3";


const AddToFavorite: React.FC = () => {
  const banks = [
  { id: "IBK", name: "IBK기업은행", logo: "/BankLogos/IBK기업은행.png" },
  { id: "KB", name: "국민은행", logo: "/BankLogos/KB국민은행.png" },
  { id: "KDB", name: "KDB산업은행", logo: "/BankLogos/KDB산업은행.png" },
  { id: "KEB", name: "KEB외환은행", logo: "/BankLogos/KEB외환은행.png" },
  { id: "NH", name: "NH농협은행", logo: "/BankLogos/NH농협은행.png" },
  { id: "SBI", name: "SBI저축은행", logo: "/BankLogos/SBI저축은행.png" },
  { id: "SC", name: "SC제일은행", logo: "/BankLogos/SC제일은행.png" },
  { id: "KYUNGNAM", name: "경남은행", logo: "/BankLogos/경남은행.png" },
  { id: "GWANJU", name: "광주은행", logo: "/BankLogos/광주은행.png" },
  { id: "DAEGU", name: "대구은행", logo: "/BankLogos/대구은행.png" },
  { id: "BUSAN", name: "부산은행", logo: "/BankLogos/부산은행.png" },
  { id: "SANLIM", name: "산림조합", logo:"/BankLogos/산림조합.png" },
  { id: "SAEMAEUL", name: "새마을은행", logo: "/BankLogos/새마을은행.png" },
  { id: "SUHYUB", name: "수협은행", logo: "/BankLogos/수협은행.png" },
  { id: "SHINHAN", name: "신한은행", logo:"/BankLogos/신한은행.png" },
  { id: "SHINHYUB", name: "신협은행", logo: "/BankLogos/신협은행.png" },
  { id: "CITY", name: "씨티은행", logo: "/BankLogos/씨티은행.png" },
  { id: "WOORI", name: "우리은행", logo: "/BankLogos/우리은행.png" },
  { id: "POSTBANK", name: "우체국은행", logo: "/BankLogos/우체국은행.png" },
  { id: "JYOCHUK", name: "저축은행", logo: "/BankLogos/저축은행.png" },
  { id: "JYUNBUK", name: "전북은행", logo: "/BankLogos/전북은행.png" },
  { id: "JEJU", name: "제주은행", logo: "/BankLogos/제주은행.png" },
  { id: "KAKAO", name: "카카오뱅크", logo: "/BankLogos/카카오뱅크.png" },
  { id: "TOSS", name: "토스뱅크", logo: "/BankLogos/토스뱅크.png" },
  { id: "HANA", name: "하나은행", logo: "/BankLogos/하나은행.png" },
  { id: "HANKUKTUZA", name: "한국투자증권", logo:"/BankLogos/한국투자증권.png" },
];

  const { formalName, sendAccountNum, sendBankType } = useTransferStore();

  const { setIsAudioPlaying } = useAudioSTTControlStore();

  const selectedBank = banks.find((bank) => bank.id === sendBankType) || {
    id: "BASIC",
    name: "기본은행",
    logo: defaultBankLogo,
  };

  const boldChars = ["또"];
  const text = `다음에도 또 보낼래요?`;

  // 오디오말하기
  const addToFavoriteAudio = new Audio(addToFavorite);
  const yesOrNoAudio = new Audio(sayYesOrNo);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    setIsAudioPlaying(true);
    // addToFavoriteAudio 먼저 플레이해
    addToFavoriteAudio.play();

    // 돈 보낼까요 메시지 먼저 말하고 끝나면 그 다음거 해
    addToFavoriteAudio.addEventListener("ended", () => {
      yesOrNoAudio.play();
    });

    yesOrNoAudio.addEventListener("ended", () => {
      setIsAudioPlaying(false);
    });

    // component unmount되면 중지시키고 둘다 0으로 되돌려
    return () => {
      setIsAudioPlaying(true);
      addToFavoriteAudio.pause();
      addToFavoriteAudio.currentTime = 0;

      yesOrNoAudio.pause();
      yesOrNoAudio.currentTime = 0;
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
    </div>
  );
};

export default AddToFavorite;
