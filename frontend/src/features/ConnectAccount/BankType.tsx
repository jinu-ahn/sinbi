import React from "react";
import YellowBox from "../../components/YellowBox";
import { useConnectAccountStore } from "./ConnectAccountStore";
import bankLogos from "../../assets/BankLogos";

const banks = [
  { id: "ibk", name: "IBK기업은행", logo: bankLogos["IBK기업은행 "]},
  { id: "kookmin", name: "국민은행", logo: bankLogos["KB국민은행 "]},
  { id: "kdb", name: "KDB산업은행", logo: bankLogos["KDB산업은행 "]},
  { id: "keb", name: "KEB외환은행", logo: bankLogos["KEB외환은행 "]},
  { id: "nh", name: "NH농협은행", logo: bankLogos["NH농협은행 "]},
  { id: "SBI", name: "SBI저축은행", logo: bankLogos["SBI저축은행 "]},
  { id: "SC", name: "SC제일은행", logo: bankLogos["SC제일은행 "]},
  { id: "kyungnam", name: "경남은행", logo: bankLogos["경남은행 "]},
  { id: "gwanju", name: "광주은행", logo: bankLogos["광주은행 "]},
  { id: "daegu", name: "대구은행", logo: bankLogos["대구은행 "]},
  { id: "busan", name: "부산은행", logo: bankLogos["부산은행 "]},
  { id: "sanlim", name: "산림조합", logo: bankLogos["산림조합 "]},
  { id: "saemaeul", name: "새마을은행", logo: bankLogos["새마을은행 "]},
  { id: "suhyub", name: "수협은행", logo: bankLogos["수협은행 "]},
  { id: "shinhan", name: "신한은행", logo: bankLogos["신한은행 "]},
  { id: "shinhyub", name: "신협은행", logo: bankLogos["신협은행 "]},
  { id: "city", name: "씨티은행", logo: bankLogos["씨티은행 "]},
  { id: "woori", name: "우리은행", logo: bankLogos["우리은행 "]},
  { id: "post", name: "우체국은행", logo: bankLogos["우체국은행 "]},
  { id: "jyochuk", name: "저축은행", logo: bankLogos["저축은ㅁ행 "]},
  { id: "jyunbuk", name: "전북은행", logo: bankLogos["전북은행 "]},
  { id: "jeju", name: "제주은행", logo: bankLogos["제주은행 "]},
  { id: "kakao", name: "카카오뱅크", logo: bankLogos["카카오뱅크 "]},
  { id: "toss", name: "토스뱅크", logo: bankLogos["토스뱅크 "]},
  { id: "hana", name: "하나은행", logo: bankLogos["하나은행 "]},
  { id: "hankuktuza", name: "한국투자증권", logo: bankLogos["한국투자증권 "]},
];

const BankType: React.FC = () => {
  const { bankType, setBankType } = useConnectAccountStore();


  return (
    <div>
      <header>
        <h1>통장 등록</h1>
      </header>

      <div>
        <YellowBox>
          <div>
            <p className="font-bold text-[30px]">은행</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {banks.map((bank) => (
              <div
                key={bank.id}
                onClick={() => setBankType(bank.id)}
                className={`border p-2 rounded-lg flex flex-col items-center cursor-pointer ${
                  bankType === bank.id ? "border-blue-500" : "border-gray-300"
                }`}
              >
                <img src={bank.logo} alt={bank.name} className="w-16 h-16" />
                <p>{bank.name}</p>
              </div>
            ))}
          </div>
        </YellowBox>
      </div>
    </div>
  );
};

export default BankType;
