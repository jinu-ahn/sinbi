import React from "react";
import avatar from "../../assets/avatar.png";
import { useConnectAccountStore } from "./ConnectAccountStore";
import ConnectAccountVoiceCommand from "./ConnectAccountVoiceCommand";
import AccountNumber from "./AccountNumber";
import BankType from "./BankType";

const ConnectAccountPage: React.FC = () => {
  const { step } = useConnectAccountStore();

  const renderComponent = () => {
    switch (step) {
      case 0:
        return <AccountNumber />;
      case 1:
        return <BankType />;
      // case 별 컴포넌트 추가해나가면 됨
      default:
        return <AccountNumber />;
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-8">
      {renderComponent()}

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[318px] h-[204px]">
        <img src={avatar} alt="Avatar" className="w-full h-full object-contain" />
      </div>

      <ConnectAccountVoiceCommand />
    </div>
  );
};

export default ConnectAccountPage;