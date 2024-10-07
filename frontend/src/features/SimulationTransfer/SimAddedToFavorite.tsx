import React, { useEffect } from "react";
import { useSimTransferStore } from "./SimTransferStore";
import BlackText from "../../components/BlackText";
import YellowBox from "../../components/YellowBox";

const SimAddedToFavorite: React.FC = () => {
  const { formalName, setNickName, setStep, step } = useSimTransferStore();
  const boldChars = [`${formalName}`];
  const text = `${formalName}님을 즐겨찾기에 추가했어요.`;

  useEffect(() => {
    // 2초 뒤에 즐겨찾기로 보내는 로직
    const timer = setTimeout(() => {
      setNickName("");
      setStep(step + 1)
    }, 2000);
    // component가 unmount되면 timeout function 중지
    return () => clearTimeout(timer);
  }, []);

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

export default SimAddedToFavorite;
