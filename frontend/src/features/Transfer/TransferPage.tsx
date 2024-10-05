import React from "react";
import avatar from "../../assets/avatar.png";
import { useTransferStore } from "./TransferStore";

// 페이지 순서
import MyAccounts from "./MyAccounts";
import FavoriteAccounts from "./FavoriteAccounts";
import RecvAccountNumber from "./RecvAccountNumber";
import RecvBankType from "./RecvBankType";
import RecvAmount from "./RecvAmount";
import Warning from "./Warning";
import TransferCheck from "./TransferCheck";
import TransferConfirm from "./TransferConfirm";
import AddToFavorite from "./AddToFavorite";
import AddNickName from "./AddNickName";
import GoBackHome from "./GoBackHome";

import TransferVoiceCommand from "./TransferVoiceCommand";


const TransferPage: React.FC = () => {
  const { step } = useTransferStore();


  // step 0 : 내 통장 목록 띄우기
  // step 1 : 즐겨찾는 계좌 목록 띄우기
  // step 2 : 받을 사람 계좌번호 입력
  // step 3 : 받을 사람 은행 입력 (여기서 그 사람이 존재하는지 체크 sendVirtualAccount)
  // step 4 : 얼마 보낼건지 입력
  // step 5 : 경고창 띄워주기
  // step 6 : 진짜 보낼거냐고 묻기 (응 / 예 들으면 여기서 이체)
  // step 7 : 보냈어요 페이지
  // step 8 : 다음에 또 보낼거냐고 묻기 (아니오 하면 메인페이지 응 하면 다음페이지)
  // step 9 : 즐겨찾기 계좌에 뭐라고 등록하는지 묻기 (이름 들으면 저장해서 즐겨찾는 계좌에 등록)
  const renderComponent = () => {
    switch (step) {
      case 0:
        return <MyAccounts userId={1} />;
      case 1:
        return <FavoriteAccounts userId={1} />;
      case 2:
        return <RecvAccountNumber />;
      case 3:
        return <RecvBankType />;
      case 4:
        return <RecvAmount />;
      case 5:
        return <Warning />;
      case 6:
        return <TransferCheck />;
      case 7:
        return <TransferConfirm />;
      case 8:
        return <AddToFavorite />;
      case 9:
        return <AddNickName />;
      case 10:
        return <GoBackHome />;
      // case 별 컴포넌트 추가해나가면 됨
      default:
        return <MyAccounts userId={1} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center py-8">
      {renderComponent()}

      <div className="absolute bottom-0 left-1/2 z-0 h-[230px] w-[318px] -translate-x-1/2 transform">
        <img
          src={avatar}
          alt="Avatar"
          className="z-0 h-full w-full object-contain"
        />
      </div>

      <TransferVoiceCommand />
    </div>
  );
};

export default TransferPage;
