import React, { useEffect } from "react";
import YellowBox from "../../components/YellowBox";
import { useConnectAccountStore } from "./ConnectAccountStore";
import { useAudioSTTControlStore } from "../../store/AudioSTTControlStore";

import chooseBank from "../../assets/audio/13_은행을_말하거나_찾아서_눌러주세요.mp3";



const banks = [
{ id: "IBK", name: "IBK기업은행", logo: "/BankLogos/IBK기업은행.png" },  { id: "KB", name: "국민은행", logo: "/BankLogos/KB국민은행.png" },
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


const BankType: React.FC = () => {
  const { bankType, setBankType, error, setError } = useConnectAccountStore();
  const { setIsAudioPlaying } = useAudioSTTControlStore();

  // 오디오말하기
  const audio = new Audio(chooseBank);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    setIsAudioPlaying(true)
    // 플레이시켜
    audio.play();

    audio.addEventListener("ended", () => {
      setIsAudioPlaying(false)
    })

    // 근데 component가 unmount 되면 플레이 중지! 시간 0초로 다시 되돌려
    return () => {
      setIsAudioPlaying(false)
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    console.log("bankType : ", bankType);
    setError(null);
  }, [bankType]);

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

      <div className="mt-4 flex w-full justify-center">
        <YellowBox>
          <div>
            <p className="text-[30px] font-bold">은행</p>
          </div>

          {/* 스크린 길이 말고 div 내에서 계속 스크롤되게 div 고정 */}
          <div className="grid max-h-64 grid-cols-3 gap-4 overflow-y-auto">
            {banks.map((bank) => (
              <div
                key={bank.id}
                onClick={() => setBankType(bank.id)}
                className={`flex cursor-pointer flex-col items-center rounded-lg border p-2 ${
                  bankType === bank.id ? "border-blue-500" : "border-gray-300"
                }`}
              >
                <img src={bank.logo} alt={bank.name} className="h-16 w-16" />
                <p className="font-bold">{bank.name}</p>
              </div>
            ))}
          </div>
        </YellowBox>
      </div>
    </div>
  );
};

export default BankType;
