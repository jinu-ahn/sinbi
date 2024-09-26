import React, { useEffect } from "react";
import { myAccounts } from "../../services/api";
import YellowBox from "../../components/YellowBox";
import bankLogos from "../../assets/bankLogos";
import { useTransferStore } from "./TransferStore";

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

const MyAccounts: React.FC<{ userId: number }> = ({ userId }) => {
  // 내 계좌 목록 저장할것 가져오기
  const { step, setStep, error, setMyAccountId, setAccounts, accounts } =
    useTransferStore();

  // 내 계좌 불러와서 accounts list에 저장
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await myAccounts(userId);
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
  }, [userId]);

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
