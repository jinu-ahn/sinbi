import React, { useEffect } from "react";
import { myAccounts } from "../../services/api";
import YellowBox from "../../components/YellowBox";
import SpecificAccount from "./SpecificAccount";
import bankLogos from "../../assets/bankLogos";
import { useAccountViewStore } from "./AccountViewStore";
import { useAudioSTTControlStore } from "../../store/AudioSTTControlStore";

import thisIsAccountList from "../../assets/audio/38_현재_가지고_계신_통장_목록이에요.mp3";

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

interface Account {
  id: string;
  accountNum: string;
  bankType: string;
  productName: string;
  amount: number;
}

const MyAccounts: React.FC = () => {
  // 내 계좌 목록 저장할것 가져오기
  const {
    accounts,
    setAccounts,
    setStep,
    step,
    selectedAccount,
    setSelectedAccount,
  } = useAccountViewStore();

  const { setIsAudioPlaying } = useAudioSTTControlStore();

  // 내 계좌 불러와서 accounts list에 저장
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await myAccounts();
        // response.data가 배열이면
        if (Array.isArray(response.data)) {
          console.log(response.data);
          setAccounts(response.data);
        } else {
          setAccounts([]);
        }
      } catch (error) {
        console.error("계좌 목록 불러오는데 실패했습니다:", error);
        setAccounts([]);
      }
    };
    fetchAccounts();
  }, []);

  // 클릭하면 계좌 상세 페이지로 이동
  const handleAccountClick = (account: Account) => {
    setSelectedAccount(account);
    setStep(step + 1);
  };

  // 은행 로고 이미지 찾자
  const getBankLogo = (bankType: string): string | undefined => {
    const bank = banks.find((b) => b.id === bankType);
    return bank ? bank.logo : undefined;
  };

  // 오디오말하기
  const audio = new Audio(thisIsAccountList);

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
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
        setIsAudioPlaying(true)
      }
    };
  }, []);

  return (
    <div>
      <header>
        {/* 선택된 상세 계좌 있으면 상세 계좌 이름 보여줌 | 없으면 모든 통장 리스트 */}
        {!selectedAccount ? (
          <h1 className="text-center text-[40px] font-bold">모든 통장</h1>
        ) : (
          <div className="m-1 p-1">
            {/* 은행로고랑 통장이름 div */}
            <div className="ml-5 mt-4 flex items-center text-left">
              <img
                className="mr-2 h-[40px] w-[40px]"
                src={getBankLogo(selectedAccount.bankType)}
                alt={selectedAccount.bankType}
              />
              <div className="flex flex-col">
                {/* 통장 이름 */}
                <span className="text-[20px] font-bold">
                  {selectedAccount.productName}
                </span>
                {/* 아래에 계좌번호 */}
                <span className="text-left text-[16px]">
                  {selectedAccount.accountNum}
                </span>
              </div>
            </div>

            {/* 계좌 잔액은 왼쪽으로 */}
            <p className="mr-5 mt-2 text-right text-[35px] font-bold">
              {selectedAccount.amount} 원
            </p>
          </div>
        )}
      </header>

      {/* 선택된 상세 계좌 있으면 상세 계좌 이름 보여줌 | 없으면 모든 통장 리스트 */}
      <div className="mt-4 flex w-[350px] justify-center">
        <YellowBox>
          {!selectedAccount ? (
            <ul className="h-[250px] overflow-y-auto">
              {/* div 크기 고정 안에서 scroll */}
              {accounts.length > 0 ? (
                accounts.map((account) => (
                  <div key={account.id} className="m-1 bg-white p-1">
                    <li
                      className="flex items-center rounded-md text-[30px]"
                      onClick={() => handleAccountClick(account)}
                    >
                      <img
                        src={getBankLogo(account.bankType)}
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
          ) : (
            <SpecificAccount accountId={selectedAccount.id} />
          )}
        </YellowBox>
      </div>
    </div>
  );
};

export default MyAccounts;
