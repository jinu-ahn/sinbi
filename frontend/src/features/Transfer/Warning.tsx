import React from "react";

const Warning: React.FC = () => {
  const boldChars = ["모르는 사람", "위험"];
  const text = "모르는 사람에게 돈 보내면 위험해요!";

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
          <span key={index} className="font-bold text-[#ff0f0f]">
            {part}
          </span>
        );
      }
      // bold로 바꿔야하는 애들이 아니면 className 적용x
      return (
        <span key={index} className="text-[#ff0f0f]">
          {part}
        </span>
      );
    });
  };

  return (
    <div className="flex h-1/4 w-4/5 items-center justify-center border-2 border-[#ff0f0f] mt-[100px]">
      <div className={`text-center text-[36px] leading-relaxed`}>
        {renderTextWithBold()}
      </div>
    </div>
  );
};

export default Warning;
