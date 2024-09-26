import React from "react";
import { useTransferStore } from "./TransferStore";
import BlackText from "../../components/BlackText";
import YellowBox from "../../components/YellowBox";

const TransferCheck: React.FC = () => {
  const { formalName, money } = useTransferStore();
  const boldChars = [`${formalName}`, `${money}`, "원"];
  const text = `${formalName} 님에게 ${money} 원 보낼까요?`;

  return (
    <div className="mt-[80px] flex items-center justify-center">
      <YellowBox>
        <BlackText
          textSize="text-[30px]"
          text={text}
          boldChars={boldChars}
        ></BlackText>
      </YellowBox>
    </div>
  );
};

export default TransferCheck;
