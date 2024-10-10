import React, { useEffect } from "react";
import { myAccounts } from "../../services/api";
import YellowBox from "../../components/YellowBox";
import { useTransferStore } from "./TransferStore";
import pickMyBankAccount from "../../assets/audio/22_어느_통장에서_돈을_보낼까요_하나를_골라_눌러주세요.mp3";


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

interface Account {
  id: string;
  accountNum: string;
  bankType: string;
  productName: string;
  amount: number;
}

const MyAccounts: React.FC = () => {
  // 내 계좌 목록 저장할것 가져오기
  const { step, setStep, error, setMyAccountId, setAccounts, accounts } =
    useTransferStore();

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

  // 오디오말하기
  const audio = new Audio(pickMyBankAccount);

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

  // 클릭하면 내가 무슨 통장에서 보내는지 통장 id 저장 + 다음 페이지로 이동
  const handleAccountClick = (account: Account) => {
    setMyAccountId(Number(account.id));
    setStep(step + 1);
  };

  // 은행 로고 이미지 찾자
  const getBankLogo = (bankType: string): string | undefined => {
    const bank = banks.find((b) => b.id === bankType);
    return bank ? bank.logo : undefined;
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
          <ul className="h-[250px] overflow-y-auto">
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
        </YellowBox>
      </div>
    </div>
  );
};

export default MyAccounts;
