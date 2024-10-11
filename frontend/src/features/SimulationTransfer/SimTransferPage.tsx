import React from "react";
import avatar from "../../assets/avatar.png";
import { useSimTransferStore } from "./SimTransferStore";

// 페이지 순서
import SimLetsStartSendMoney from "./SimLetsStartSendMoney";
import SimMyAccounts from "./SimMyAccounts";
import SimNoFavoriteAccounts from "./SimNoFavoriteAccounts";
import SimRecvAccountNumber from "./SimRecvAccountNumber";
import SimRecvBankType from "./SimRecvBankType";
import SimRecvAmount from "./SimRecvAmount";
import SimWarning from "./SimWarning";
import SimTransferCheck from "./SimTransferCheck";
import SimTransferConfirm from "./SimTransferConfirm";
import SimAddToFavorite from "./SimAddToFavorite";
import SimAddNickName from "./SimAddNickName";
import SimLetsStartSendMoneyToFavorite from "./SimLetsStartSendMoneyToFavorite";
import SimYesFavoriteAccounts from "./SimYesFavoriteAccounts";
import SimAddedToFavorite from "./SimAddedToFavorite";
import SimGoBackHome from "./SimGoBackHome";

import SimTransferVoiceCommand from "./SimTransferVoiceCommand";

const SimTransferPage: React.FC = () => {
  const { step } = useSimTransferStore();

  // 함수같은건 필요없어.. 걍 가짜로 만들어서 버튼만 누르게 만들면 됨
  // step 0 : 지금부터 돈 보내기를 같이 연습해요. 걱정 마세요! 가짜 돈이에요.
  // step 1 : 처음 = 내 통장 목록 띄우기 (가짜통장 1개)
  // step 1 : 회귀 = 지금부터 자주 보내는 계좌로 돈 보내기를 같이 연습해요.
  // step 2 : 처음 = 즐겨찾는 계좌 목록 띄우기 (아직 아무것도 없음)
  // step 2 : 회귀 = 즐겨찾는 계좌 목록 띄우기 (이제 생김)
  // step 3 : 받을 사람 계좌번호 입력 (내가 알려줘)
  // step 4 : 받을 사람 은행 입력 (여기서 그 사람이 존재하는지 체크 sendVirtualAccount) (내가 알려줘)
  // step 5 : 얼마 보낼건지 입력 (내가 알려줘)
  // step 6 : 경고창 띄워주기
  // step 7 : 진짜 보낼거냐고 묻기 (응 / 예 들으면 여기서 이체)
  // step 8 : 보냈어요 페이지
  // step 9 : 다음에 또 보낼거냐고 묻기 ( 무조건 예 하게 만들어 )
  // step 10 : 즐겨찾기 계좌에 뭐라고 등록하는지 묻기 (뭐라고 등록할지 내가 알려줘)
  // step 11 : 즐겨찾기 계좌에 은행 비서 (신비) 를 추가했어요.
  // step 12 : 즐겨찾기 계좌로 돈을 보내봐요 소개페이지
  // step 13 : 즐겨찾기 계좌 목록이에요. '은행 비서'를 선택하세요.
  // step 14 : 얼마 보낼까요?
  // step 15 : 진짜 보내요?
  // step 16 : 보냈어요.
  // step 17 : 집에 갑시다

  const renderComponent = () => {
    switch (step) {
      case 0:
        return <SimLetsStartSendMoney />;
      case 1:
        return <SimMyAccounts />;
      case 2:
        return <SimNoFavoriteAccounts />;
      case 3:
        return <SimRecvAccountNumber />;
      case 4:
        return <SimRecvBankType />;
      case 5:
        return <SimRecvAmount />;
      case 6:
        return <SimWarning />;
      case 7:
        return <SimTransferCheck />;
      case 8:
        return <SimTransferConfirm />;
      case 9:
        return <SimAddToFavorite />;
      case 10:
        return <SimAddNickName />;
      case 11:
        return <SimAddedToFavorite />;
      case 12:
        return <SimLetsStartSendMoneyToFavorite />;
      case 13:
        return <SimYesFavoriteAccounts />;
      case 14:
        return <SimRecvAmount />;
      case 15:
        return <SimTransferCheck />;
      case 16:
        return <SimTransferConfirm />;
      case 17:
        return <SimGoBackHome />;
      // case 별 컴포넌트 추가해나가면 됨
      default:
        return <SimMyAccounts />;
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

      <SimTransferVoiceCommand />
    </div>
  );
};

export default SimTransferPage;
