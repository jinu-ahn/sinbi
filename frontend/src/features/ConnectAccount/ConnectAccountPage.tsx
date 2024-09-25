import React from "react";
import avatar from "../../assets/avatar.png";
import { useConnectAccountStore } from "./ConnectAccountStore";
import ConnectAccountVoiceCommand from "./ConnectAccountVoiceCommand";
import AccountNumber from "./AccountNumber";
import BankType from "./BankType";
import AccountCheck from "./AccountCheck";
import PhoneNumAsk from "./PhoneNumAsk";
import VerificationCode from "./VerificationCode";
import AccountConfirm from "./AccountConfirm";

const ConnectAccountPage: React.FC = () => {
  const { step } = useConnectAccountStore();

  const renderComponent = () => {
    switch (step) {
      case 0:
        return <AccountNumber />;
      case 1:
        return <BankType />;
      case 2:
        return <AccountCheck />;
      case 3:
        return <PhoneNumAsk />;
      case 4:
        return <VerificationCode />;
      case 5:
        return <AccountConfirm />;
      // case 별 컴포넌트 추가해나가면 됨
      default:
        return <AccountNumber />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center py-8">
      {renderComponent()}

      <div className="absolute bottom-0 left-1/2 h-[204px] w-[318px] -translate-x-1/2 transform">
        <img
          src={avatar}
          alt="Avatar"
          className="h-full w-full object-contain"
        />
      </div>

      <ConnectAccountVoiceCommand />
    </div>
  );
};

export default ConnectAccountPage;
