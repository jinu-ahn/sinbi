import React, { useEffect } from "react";
// import { favoriteAccounts } from "../../services/api";
import YellowBox from "../../components/YellowBox";
import bankLogos from "../../assets/bankLogos";
import { useSimTransferStore } from "./SimTransferStore";
import { useAudioSTTControlStore } from "../../store/AudioSTTControlStore";
import SpeechBubble from "../../components/SpeechBubble";

import sayNewAccount from "../../assets/audio/69_여기에서_내가_돈을_자주_보낼_사람들을_보여줄_거예요_아직_아무것도_없네요.mp3";

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

interface FavAccount {
  bankType: string;
  id: number;
  recvAccountNum: string;
  recvAlias: string;
  recvName: string;
}

// 즐겨찾기통장 중에서 골랐으면 이따 보내주기 위해 저장해둬야 할것
// 상대방 계좌번호, 은행 종류, 보낼 금액

const SimNoFavoriteAccounts: React.FC = () => {
  // 즐겨찾는 계좌 목록 저장할것 가져오기
  const {
    step,
    setStep,
    error,
    // setFavAccounts,
    favAccounts,
    setSendAccountNum,
    setSendBankType,
    setFormalName,
    setFavAccountId,
  } = useSimTransferStore();

  const { setIsAudioPlaying } = useAudioSTTControlStore();

  const text = "새로운 계좌를\n말하거나\n눌러주세요.";
  const boldChars = ["말", "눌러", "새로운 계좌"];

  // 가짜 즐겨찾는 계좌
  // setFavAccounts()
  // const practiceFavAccount = [{ recvAccountNum: "987654321", bankType: "SINBI", id: '1', recvAlias: '작은 아들', recvName: "홍길동"}]

  // 오디오말하기
  const audio = new Audio(sayNewAccount);

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
      setIsAudioPlaying(true)
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  const handleAccountClick = (account: FavAccount) => {
    setFavAccountId(account.id);
    setSendAccountNum(account.recvAccountNum);
    setSendBankType(account.bankType);
    setFormalName(account.recvName);
    setStep(step + 3);
  };

  const handleNewAccountClick = () => {
    setStep(step + 1);
  };

  // 은행 로고 이미지 찾자
  const getBankLogo = (bankType: string): string | undefined => {
    const bank = banks.find((b) => b.id === bankType);
    return bank ? bank.logo : undefined;
  };

  // 은행 이름 찾자
  const getBankName = (bankType: string): string | undefined => {
    const bankName = banks.find((b) => b.id === bankType);
    return bankName ? bankName.name : undefined;
  };

  return (
    <div>
      <header>
        <h1 className="text-center text-[40px] font-bold">즐겨찾는 통장</h1>
      </header>

      {/* 아무것도 입력안하고 넘어가려고 하면 에러페이지 띄움 */}
      {error && (
        <p className="mt-4 text-center text-[25px] font-bold text-red-500">
          {error}
        </p>
      )}

      {/* 즐겨찾기 통장 리스트 */}
      <div className="mt-4 flex h-[330px] w-[350px] justify-center">
        <YellowBox>
          <ul className="h-[250px] overflow-y-auto">
            {/* div 크기 고정 안에서 scroll */}
            {favAccounts.length > 0 ? (
              favAccounts.map((account) => (
                <div
                  onClick={() => handleAccountClick(account)}
                  key={account.id}
                  className="mb-4 bg-white p-1"
                >
                  {/* 상대방 계좌 이름 */}
                  <p className="text-[30px]">
                    {account.recvAlias ? account.recvAlias : account.recvName}
                  </p>
                  <li className="flex items-center overflow-x-auto whitespace-nowrap rounded-md text-[20px]">
                    {/* 로고 + 은행 이름 + 계좌번호 */}
                    <img
                      src={getBankLogo(account.bankType)}
                      alt={account.bankType}
                      className="mr-2 h-8 w-8"
                    />
                    <p>{getBankName(account.bankType)}</p>

                    <p className="ml-2 text-left">{account.recvAccountNum}</p>
                  </li>
                </div>
              ))
            ) : (
              <div className="flex h-full flex-col items-center justify-center">
                <li className="text-[28px]">즐겨찾는</li>
                <li className="text-[28px]">계좌 목록이</li>
                <li className="text-[28px]">없습니다.</li>
              </div>
            )}
          </ul>
        </YellowBox>
      </div>

      <div className="absolute bottom-[-50px] left-1/2 z-10 flex h-screen -translate-x-1/2 items-center justify-center">
        <button
          onClick={() => handleNewAccountClick()}
          className="z-10 m-2 rounded-md bg-yellow-400 p-2 text-[30px] font-bold"
        >
          새로운 계좌
        </button>
      </div>

      <div className="flex w-full justify-center">
        <SpeechBubble text={text} boldChars={boldChars} />
      </div>
    </div>
  );
};

export default SimNoFavoriteAccounts;
