import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import YellowBox from "../../components/YellowBox";
import { useConnectAccountStore } from "./ConnectAccountStore";
import defaultBankLogo from "../../assets/defaultBankLogo.png";
import { registerAccount } from "../../services/api";
import GreenText from "../../components/GreenText";
import { useAudioSTTControlStore } from "../../store/AudioSTTControlStore";

import accountDone from "../../assets/audio/17_통장_등록이_끝났어요_첫_화면으로_갈게요.mp3";
import accountNotDone from "../../assets/audio/79_통장_등록을_하지_못했어요_이미_연결하신_계좌인지_확인해보세요.mp3"; // Import error audio



const AccountConfirm: React.FC = () => {
  const {
    bankType,
    accountNum,
    setAccountNum,
    setBankType,
    setError,
    setPhoneNum,
    setVerificationCode,
  } = useConnectAccountStore();

  const [registrationError, setRegistrationError] = useState(false); // Manage error state

  const banks = [
  { id: "IBK", name: "IBK기업은행", logo: "/BankLogos/IBK기업은행.png" },    { id: "KB", name: "국민은행", logo: "/BankLogos/KB국민은행.png" },
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
  

  const errorText =
    "통장 등록을 하지 못했어요. 이미 연결하신 통장이 아닌지 확인해보세요.";
  const errorBoldChars = ["못했어요", "이미 연결", "확인"];

  const selectedBank = banks.find((bank) => bank.id === bankType) || {
    id: "BASIC",
    name: "기본은행",
    logo: defaultBankLogo,
  };

  const navigate = useNavigate();

  const { setIsAudioPlaying } = useAudioSTTControlStore();

  // 오디오말하기
  const successAudio = new Audio(accountDone);
  const errorAudio = new Audio(accountNotDone); // Create an audio object for error case

  // 통장 등록
  useEffect(() => {
    const registerAccounts = async () => {
      try {
        setIsAudioPlaying(true)
        const response = await registerAccount(accountNum, bankType);
        console.log(accountNum, bankType);
        console.log(response);
        setRegistrationError(false); // If successful, ensure error state is false
        successAudio.play(); // Play success audio
        successAudio.addEventListener("ended", () => {
          setIsAudioPlaying(false)
        })
      } catch (err) {
        setIsAudioPlaying(true)
        console.error("Error fetching account data: ", err);
        setRegistrationError(true); // Set error state to true on failure
        errorAudio.play(); // Play error audio
        errorAudio.addEventListener("ended", () => {
          setIsAudioPlaying(false)
        })
        
      }
    };

    registerAccounts();
  }, [accountNum, bankType]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigate("/main");
  //     setAccountNum("");
  //     setBankType("");
  //     setError("");
  //     setPhoneNum("");
  //     setVerificationCode("");
  //   }, 3000);

  //   return () => clearTimeout(timer);
  // }, [navigate]);

  return (
    <div>
      <header>
        <h1 className="text-center text-[40px]">통장 등록 완료</h1>
      </header>

      {/* Conditionally render YellowBox if no registration error */}
      {!registrationError ? (
        <div className="mt-4 flex w-[350px] justify-center">
          <YellowBox>
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
            <div>
              <p className="text-[30px] font-bold">{accountNum}</p>
            </div>
          </YellowBox>
        </div>
      ) : (
        // Render GreenText when there is a registration error
        <div>
          <GreenText text={errorText} boldChars={errorBoldChars} />
        </div>
      )}
    </div>
  );
};

export default AccountConfirm;
