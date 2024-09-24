import React from "react";
import YellowBox from "../../components/YellowBox";
import { useConnectAccountStore } from "./ConnectAccountStore";

const PhoneNumAsk: React.FC = () => {
  const { phoneNum, setPhoneNum, error } = useConnectAccountStore();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNum(e.target.value);
  };

  return (
    <div>
      <header>
        <h1 className="text-[40px] text-center">본인 인증</h1>
      </header>

      {/* 아무것도 입력안하고 넘어가려고 하면 에러페이지 띄움 */}
      {error && (
        <p className="text-red-500 text-center mt-4 text-[25px] font-bold">
          {error}
        </p>
      )}

      <div className="flex justify-center mt-4 w-[350px]">
        <YellowBox>
          <div>
            <p className="font-bold text-[30px] mb-[20px]">전화번호</p>
          </div>
          <div>
            <input
              type="number"
              value={phoneNum}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-lg text-[35px]"
            />
          </div>
        </YellowBox>
      </div>
    </div>
  );
};

export default PhoneNumAsk;
