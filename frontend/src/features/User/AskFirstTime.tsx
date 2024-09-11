import React from "react";
import GreenText from "../../components/GreenText";

const FirstTime: React.FC = () => {
  return (
      <div className="m-1 py-8">
        <GreenText text="저희 은행 비서가 처음이신가요?" boldChars={["처음"]} />
      </div>
  );
};

export default FirstTime;