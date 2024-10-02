import React, {useEffect} from "react";
import YellowBox from "../../components/YellowBox";
import { useTransferStore } from "./TransferStore";

const RecvAmount: React.FC = () => {
  const { money, setSendMoney, error, setError, formalName, favAccountId, sendAccountNum } =
  useTransferStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSendMoney(e.target.value);
    setError(null);
  };

  useEffect(() => {
    console.log("favaccountid: ", favAccountId)
    console.log("sendAccountNum: ", sendAccountNum)
  }, [favAccountId, sendAccountNum])

  return (
    <div>
      <header>
        <h1 className="text-center text-[40px]">돈 보내기</h1>
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
            <p className="mb-[20px] text-[30px] font-bold">{formalName} <span className="font-normal">님에게</span></p>
          </div>
          <div className="flex items-center">
            <input
              type="number"
              value={money}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 p-2 text-[35px]"
            />
            <p className="text-[25px] font-bold">&nbsp;원</p>
          </div>
        </YellowBox>
      </div>
    </div>
  );
};

export default RecvAmount;
