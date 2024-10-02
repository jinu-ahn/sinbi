import React from "react";
import { BoldTextProps } from "./CommonComponent.types";

const BlackText: React.FC<BoldTextProps> = ({
  text,
  boldChars,
  textSize = "text-[36px]",
}) => {
  const renderTextWithBold = () => {
    const regex = new RegExp(`(${boldChars.join("|")})`, "g");
    // 만약 볼드로 만들고싶은게 "처음", "비서"면
    // 최종적으로 regex = /(처음|비서)/g
    // g는 global (전체적으로 matching 하는 단어를 전부 찾음)

    // 볼드체가 되어야하는 단어들 기준으로 나눠
    const parts = text.split(regex);

    return parts.map((part, index) => {
      // 돌면서 bold인 애들 matching 하면 bold로 바꿈
      if (boldChars.includes(part)) {
        return (
          <span key={index} className="font-bold">
            {part}
          </span>
        );
      }
      // bold로 바꿔야하는 애들이 아니면 className 적용x
      return (
        <span key={index}>
          {part}
        </span>
      );
    });
  };

  return (
    <div className={`text-center ${textSize} leading-relaxed`}>
      {renderTextWithBold()}
    </div>
  );
};

export default BlackText;
