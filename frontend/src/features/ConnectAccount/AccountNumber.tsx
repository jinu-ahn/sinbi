import React from "react";
import YellowBox from "../../components/YellowBox";
import { useConnectAccountStore } from "./ConnectAccountStore";

const AccountNumber: React.FC = () => {
  const { accountNum, setAccountNum } = useConnectAccountStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountNum(e.target.value);
  };

  return (
    <div>
      <header>
        <h1>통장 등록</h1>
      </header>

      <div>
        <YellowBox>
          <div>
            <p className="font-bold text-[30px]">계좌번호</p>
          </div>
          <div>
            <input
              type="number"
              value={accountNum}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
          </div>
        </YellowBox>
      </div>
    </div>
  );
};

export default AccountNumber;
