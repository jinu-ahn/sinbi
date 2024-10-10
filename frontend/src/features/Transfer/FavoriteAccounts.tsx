import React, { useEffect } from "react";
import { favoriteAccounts } from "../../services/api";
import YellowBox from "../../components/YellowBox";
import { useTransferStore } from "./TransferStore";
import sendToWho from "../../assets/audio/31_누구에게_보낼지_말하거나_눌러주세요_없으면_새로운_계좌라고_말하세요.mp3";


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

interface FavAccount {
  bankType: string;
  id: number;
  recvAccountNum: string;
  recvAlias: string;
  recvName: string;
}

// 즐겨찾기통장 중에서 골랐으면 이따 보내주기 위해 저장해둬야 할것
// 상대방 계좌번호, 은행 종류, 보낼 금액

const FavoriteAccounts: React.FC = () => {
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
  } = useTransferStore();

  // 즐겨찾는 계좌 불러와서 accounts list에 저장
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await favoriteAccounts();
        // response.data가 배열이면
        if (Array.isArray(response.data)) {
          console.log(response.data);
          setFavAccounts(response.data);
        } else {
          setFavAccounts([]);
        }
      } catch (error) {
        console.error("계좌 목록 불러오는데 실패했습니다:", error);
        setFavAccounts([]);
      }
    };
    fetchAccounts();
  }, []);

  // 오디오말하기
  const audio = new Audio(sendToWho);
  
  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    // 플레이시켜
    audio.play();

    // 근데 component가 unmount 되면 플레이 중지! 시간 0초로 다시 되돌려
    return () => {
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
      <div className="mt-4 flex w-[350px] justify-center">
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
              <li>즐겨찾는 계좌 목록이 없습니다.</li>
            )}
          </ul>
        </YellowBox>
      </div>

      <div className="absolute bottom-[-170px] left-1/2 z-10 flex h-screen -translate-x-1/2 items-center justify-center">
        <button
          onClick={() => handleNewAccountClick()}
          className="z-10 m-2 rounded-md bg-yellow-400 p-2 text-[30px] font-bold"
        >
          새로운 계좌
        </button>
      </div>
    </div>
  );
};

export default FavoriteAccounts;
