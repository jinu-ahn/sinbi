import React from "react";
import avatar from "../../assets/avatar.png";
import { useSimAccountViewStore } from "./SimAccountViewStore";
import SimAccountViewVoiceCommand from "./SimAccountViewVoiceCommand";
import MyAccounts from "./SimMyAccounts";

const SimAccountsViewPage: React.FC = () => {
  const { step } = useSimAccountViewStore();

  const renderComponent = () => {
    switch (step) {
      case 0:
        return <MyAccounts userId={1} />;
      // case 별 컴포넌트 추가해나가면 됨
      default:
        return <MyAccounts userId={1} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center py-8">
      {renderComponent()}

      <div className="absolute bottom-0 left-1/2 z-10 h-[204px] w-[318px] -translate-x-1/2 transform">
        <img
          src={avatar}
          alt="Avatar"
          className="h-full w-full object-contain"
        />
      </div>

      <SimAccountViewVoiceCommand />
    </div>
  );
};

export default SimAccountsViewPage;
