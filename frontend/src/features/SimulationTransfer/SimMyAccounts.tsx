import React, { useEffect } from "react";
// import { myAccounts } from "../../services/api";
import YellowBox from "../../components/YellowBox";
import { useSimTransferStore } from "./SimTransferStore";
import defaultBankLogo from "../../assets/defaultBankLogo.png";
import SpeechBubble from "../../components/SpeechBubble";
import { useAudioSTTControlStore } from "../../store/AudioSTTControlStore";

import pickThatAccount from "../../assets/audio/68_여기에서_내가_가지고_있는_통장을_확인할_수_있어요_신비_통장을.mp3";

interface Account {
  id: string;
  accountNum: string;
  bankType: string;
  productName: string;
  amount: number;
}

const SimMyAccounts: React.FC = () => {
  // 내 계좌 목록 저장할것 가져오기
  const { step, setStep, error, setMyAccountId, setAccounts, accounts } =
    useSimTransferStore();

  const { setIsAudioPlaying } = useAudioSTTControlStore();

  // 말풍선 안 text
  const text = "신비 통장을\n눌러주세요!";
  const boldChars = ["신비 통장", "눌러"];

  // 연습 통장
  const practiceAccount = [
    {
      accountNum: "123456789",
      amount: 50000,
      bankType: "SINBI",
      id: "0",
      productName: "신비 통장",
    },
  ];

  useEffect(() => {
    setAccounts(practiceAccount);
  }, []);

  // 오디오말하기
  const audio = new Audio(pickThatAccount);

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

  // 클릭하면 내가 무슨 통장에서 보내는지 통장 id 저장 + 다음 페이지로 이동
  const handleAccountClick = (account: Account) => {
    setMyAccountId(Number(account.id));
    setStep(step + 1);
  };

  return (
    <div>
      <header>
        <h1 className="text-center text-[40px] font-bold">내 통장</h1>
      </header>

      {/* 아무것도 입력안하고 넘어가려고 하면 에러페이지 띄움 */}
      {error && (
        <p className="mt-4 text-center text-[25px] font-bold text-red-500">
          {error}
        </p>
      )}

      {/* 선택된 상세 계좌 있으면 상세 계좌 이름 보여줌 | 없으면 모든 통장 리스트 */}
      <div className="mt-4 flex w-[350px] justify-center">
        <YellowBox>
          <ul className="h-[250px] w-[250px] overflow-y-auto">
            {/* div 크기 고정 안에서 scroll */}
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <div
                  onClick={() => handleAccountClick(account)}
                  key={account.id}
                  className="mb-4 bg-white p-1"
                >
                  <li className="flex items-center rounded-md text-[30px]">
                    <img
                      src={defaultBankLogo}
                      alt={account.bankType}
                      className="mr-2 h-8 w-8"
                    />
                    {account.productName}
                  </li>
                  <p className="text-left">&nbsp;{account.accountNum}</p>
                  <p className="text-right text-[35px] font-bold">
                    {account.amount} 원
                  </p>
                </div>
              ))
            ) : (
              <li>내 계좌 목록이 없습니다.</li>
            )}
          </ul>
        </YellowBox>
      </div>

      <div className="mt-8 flex w-full justify-center">
        <SpeechBubble text={text} boldChars={boldChars} />
      </div>
    </div>
  );
};

export default SimMyAccounts;
