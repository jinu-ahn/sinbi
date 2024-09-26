import React, { useEffect } from "react";
import YellowBox from "../../components/YellowBox";
import { useTransferStore } from "./TransferStore";
import bankLogos from "../../assets/bankLogos";

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

const RecvBankType: React.FC = () => {
  const { sendBankType, setSendBankType, error, setError } = useTransferStore();

  useEffect(() => {
    console.log("bankType : ", sendBankType);
    setError(null);
  }, [sendBankType]);

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
                onClick={() => setSendBankType(bank.id)}
                className={`flex cursor-pointer flex-col items-center rounded-lg border p-2 ${
                  sendBankType === bank.id ? "border-blue-500" : "border-gray-300"
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

export default RecvBankType;