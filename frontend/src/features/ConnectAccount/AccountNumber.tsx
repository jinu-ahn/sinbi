import React from "react";
import YellowBox from "../../components/YellowBox";
import { useConnectAccountStore } from "./ConnectAccountStore";

const AccountNumber: React.FC = () => {
  const { accountNum, setAccountNum, error, setError } = useConnectAccountStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountNum(e.target.value);
    setError(null);
  };

  return (
    <div>
      <header>
        <h1 className="text-[40px] text-center">통장 등록</h1>
      </header>

      {/* 아무것도 입력안하고 넘어가려고 하면 에러페이지 띄움 */}
      {error && <p className="text-red-500 text-center mt-4 text-[25px] font-bold">{error}</p>}

      <div className="w-full flex justify-center">
        <YellowBox>
          <div>
            <p className="font-bold text-[30px] mb-[20px]">계좌번호</p>
          </div>
          <div>
            <input
              type="number"
              value={accountNum}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-lg text-[35px]"
            />
          </div>
        </YellowBox>
      </div>
    </div>
  );
};

export default AccountNumber;
