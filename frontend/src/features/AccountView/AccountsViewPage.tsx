import React from "react";
import avatar from "../../assets/avatar.png";
import { useAccountViewStore } from "./AccountViewStore";
import AccountViewVoiceCommand from "./AccountViewVoiceCommand";
import MyAccounts from "./MyAccounts";

const AccountsViewPage: React.FC = () => {
  const { step } = useAccountViewStore();

  const renderComponent = () => {
    switch (step) {
      case 0:
        return <MyAccounts />;
      // case 별 컴포넌트 추가해나가면 됨
      default:
        return <MyAccounts />;
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-8">
      {renderComponent()}

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[318px] h-[204px]">
        <img src={avatar} alt="Avatar" className="w-full h-full object-contain" />
      </div>

      <AccountViewVoiceCommand />
    </div>
  );
};

export default AccountsViewPage;