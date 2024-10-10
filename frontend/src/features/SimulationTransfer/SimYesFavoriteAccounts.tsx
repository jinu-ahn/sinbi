import React, { useEffect } from "react";
// import { favoriteAccounts } from "../../services/api";
import YellowBox from "../../components/YellowBox";
import { useSimTransferStore } from "./SimTransferStore";
import { useAudioSTTControlStore } from "../../store/AudioSTTControlStore";
import SpeechBubble from "../../components/SpeechBubble";
import sinbiBankLogo from "../../assets/defaultBankLogo.png";

import sayNewAccount from "../../assets/audio/77_아까_추가한_제_계좌가_여기_뜨네요_저한테_다시_한번_돈을_보내봐요_은행_비서.mp3";

interface FavAccount {
  bankType: string;
  id: number;
  recvAccountNum: string;
  recvAlias: string;
  recvName: string;
}

// 즐겨찾기통장 중에서 골랐으면 이따 보내주기 위해 저장해둬야 할것
// 상대방 계좌번호, 은행 종류, 보낼 금액

const SimYesFavoriteAccounts: React.FC = () => {
  // 즐겨찾는 계좌 목록 저장할것 가져오기
  const {
    step,
    setStep,
    error,
    setFavAccounts,
    favAccounts,
    setSendAccountNum,
    setSendBankType,
    setFormalName,
    setFavAccountId,
  } = useSimTransferStore();

  const { setIsAudioPlaying } = useAudioSTTControlStore();

  const text = '"은행 비서"\n말하거나\n눌러주세요.';
  const boldChars = ["말", "눌러", "은행 비서"];

  // 가짜 즐겨찾는 계좌
  // setFavAccounts()
  const practiceFavAccount = [
    {
      recvAccountNum: "987654321",
      bankType: "SINBI",
      id: 1,
      recvAlias: "은행 비서",
      recvName: "신비",
    },
  ];

  useEffect(() => {
    setFavAccounts(practiceFavAccount);
  }, []);

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
      setIsAudioPlaying(false)
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
                      src={sinbiBankLogo}
                      alt="신비은행"
                      className="mr-2 h-8 w-8"
                    />
                    <p>신비은행</p>

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

export default SimYesFavoriteAccounts;
