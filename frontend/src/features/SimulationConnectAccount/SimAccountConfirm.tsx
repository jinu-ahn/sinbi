import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import YellowBox from "../../components/YellowBox";
import { useSimConnectAccountStore } from "./SimConnectAccountStore";
import defaultBankLogo from "../../assets/defaultBankLogo.png";
import SpeechBubble from "../../components/SpeechBubble";
import { registerAccount } from "../../services/api";

import { useSimMainStore } from "../SimulationMainPage/SimMainStore";

import accountDone from "../../assets/audio/65_통장_등록이_끝났어요_'집'_또는_'시작_화면'이라고_얘기해_보세요.mp3";



const SimAccountConfirm: React.FC = () => {
  const {
    bankType,
    accountNum,
    // setAccountNum,
    // setBankType,
    // setError,
    // setPhoneNum,
    // setVerificationCode,
  } = useSimConnectAccountStore();
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

  const { setMainStep } = useSimMainStore();

  const selectedBank = banks.find((bank) => bank.id === bankType) || {
    id: "BASIC",
    name: "기본은행",
    logo: defaultBankLogo,
  };

  const text = '통장 등록 끝!\n"집" 또는\n"시작 화면"을\n말해주세요.';
  const boldChars = ["끝", "시작 화면", "집", "말"];

  // const navigate = useNavigate();

  // 통장 등록
  useEffect(() => {
    const registerAccounts = async () => {
      try {
        const response = await registerAccount(accountNum, bankType);
        console.log(accountNum, bankType);
        console.log(response);
      } catch (err) {
        console.error("Error fetching account data: ", err);
      }
    };

    registerAccounts();
  }, []);

  // 오디오말하기
  const audio = new Audio(accountDone);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    // 플레이시켜
    audio.play();
    setMainStep(2);

    // 근데 component가 unmount 되면 플레이 중지! 시간 0초로 다시 되돌려
    return () => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  // useEffect(() => {
  //   // 3초 뒤에 홈으로 간다
  //   const timer = setTimeout(() => {
  //     navigate("/sim");
  //     setAccountNum("");
  //     setBankType("");
  //     setError("");
  //     setPhoneNum("");
  //     setVerificationCode("");
  //   }, 3000);
  //   // component가 unmount되면 timeout function 중지
  //   return () => clearTimeout(timer);
  // }, [navigate]);

  return (
    <div>
      <header>
        <h1 className="text-center text-[40px]">통장 등록 완료</h1>
      </header>

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

export default SimAccountConfirm;
