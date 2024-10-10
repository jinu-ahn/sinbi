import React, { useEffect } from "react";
import YellowBox from "../../components/YellowBox";
import { useConnectAccountStore } from "./ConnectAccountStore";
import defaultBankLogo from "../../assets/defaultBankLogo.png";

import isThisAccountRight from "../../assets/audio/15_이_계좌가_맞나요.mp3";
import anErrorOccurred from "../../assets/audio/14_해당하는_계좌가_없어요_다시_한번_확인해주세요.mp3";
import goBack from "../../assets/audio/05_뒤로_가려면_이전이라고_말해주세요.mp3";


const AccountCheck: React.FC = () => {
  const { bankType, accountNum, error } = useConnectAccountStore();
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
  

  const selectedBank = banks.find((bank) => bank.id === bankType) || {
    id: "BASIC",
    name: "기본은행",
    logo: defaultBankLogo,
  };

  // 오디오말하기
  const isThisAccountRightaudio = new Audio(isThisAccountRight);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    if (!error) {
      // 플레이시켜
      isThisAccountRightaudio.play();
    }

    // 근데 component가 unmount 되면 플레이 중지! 시간 0초로 다시 되돌려
    return () => {
      if (!isThisAccountRightaudio.paused) {
        isThisAccountRightaudio.pause();
        isThisAccountRightaudio.currentTime = 0;
      }
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
    </div>
  );
};

export default AccountCheck;
