import React from "react";
import YellowBox from "../../components/YellowBox";
import { useTransferStore } from "./TransferStore";

const RecvAccountNumber: React.FC = () => {

  const { sendAccountNum, setSendAccountNum, error, setError } =
  useTransferStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSendAccountNum(e.target.value);
    setError(null);
  };

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

      <div className="flex w-full justify-center">
        <YellowBox>
          <div>
            <p className="mb-[20px] text-[30px] font-bold">계좌번호</p>
          </div>
          <div>
            <input
              type="number"
              value={sendAccountNum}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 p-2 text-[35px]"
            />
          </div>
        </YellowBox>
      </div>
    </div>
  );
};

export default RecvAccountNumber;