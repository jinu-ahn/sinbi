import React, { useEffect } from "react";
import { useTransferStore } from "./TransferStore";
import { useNavigate } from "react-router-dom";
import BlackText from "../../components/BlackText";
import YellowBox from "../../components/YellowBox";

const GoBackHome: React.FC = () => {
  const { formalName, setNickName } = useTransferStore();
  const boldChars = [`${formalName}`, "집"];
  const text = `${formalName}님을 즐겨찾기에 추가했어요. 집으로 돌아갈게요.`;

  const navigate = useNavigate();

  useEffect(() => {
    // 3초 뒤에 홈으로 간다
    const timer = setTimeout(() => {
      setNickName("");
      navigate("/");
    }, 3000);
    // component가 unmount되면 timeout function 중지
    return () => clearTimeout(timer);
  }, [navigate]);

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

export default GoBackHome;
