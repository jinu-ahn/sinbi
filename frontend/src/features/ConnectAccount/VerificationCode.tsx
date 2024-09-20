import React from "react";
import YellowBox from "../../components/YellowBox";
import { useConnectAccountStore } from "./ConnectAccountStore";

const VerificationCode: React.FC = () => {
  const { verificationCode, setVerificationCode } = useConnectAccountStore();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
  };

  return (
    <div>
      <header>
        <h1 className="text-[40px] text-center">본인 인증</h1>
      </header>

      <div className="flex justify-center mt-4 w-[350px]">
        <YellowBox>
          <div>
            <p className="font-bold text-[30px] mb-[20px]">인증번호</p>
          </div>
          <div>
            <input
              type="number"
              value={verificationCode}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-lg text-[35px]"
            />
          </div>
        </YellowBox>
      </div>
    </div>
  );
};

export default VerificationCode;
