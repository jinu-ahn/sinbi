import React from "react";
import avatar from "../../assets/avatar.png";
import { useSimConnectAccountStore } from "./SimConnectAccountStore";
import SimConnectAccountVoiceCommand from "./SimConnectAccountVoiceCommand";
import SimLetsStart from "./SimLetsStartConnectAccount";
import SimAccountNumber from "./SimAccountNumber";
import SimBankType from "./SimBankType";
import SimAccountCheck from "./SimAccountCheck";
import SimPhoneNumAsk from "./SimPhoneNumAsk";
import SimVerificationCode from "./SimVerificationCode";
import SimAccountConfirm from "./SimAccountConfirm";

const SimConnectAccountPage: React.FC = () => {
  const { step } = useSimConnectAccountStore();

  const renderComponent = () => {
    switch (step) {
      case 0:
        return <SimLetsStart />;
      case 1:
        return <SimAccountNumber />;
      case 2:
        return <SimBankType />;
      case 3:
        return <SimAccountCheck />;
      case 4:
        return <SimPhoneNumAsk />;
      case 5:
        return <SimVerificationCode />;
      case 6:
        return <SimAccountConfirm />;
      // case 별 컴포넌트 추가해나가면 됨
      default:
        return <SimAccountNumber />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center py-8">
      {renderComponent()}

      <div className="absolute bottom-0 left-1/2 z-10 h-[200px] w-[200px] -translate-x-1/2 transform">
        <img
          src={avatar}
          alt="Avatar"
          className="h-full w-full object-contain"
        />
      </div>

      <SimConnectAccountVoiceCommand />
    </div>
  );
};

export default SimConnectAccountPage;
