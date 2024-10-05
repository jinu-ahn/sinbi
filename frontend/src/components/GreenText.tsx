import React from "react";
import { BoldTextProps } from "./CommonComponent.types";

const GreenText: React.FC<BoldTextProps> = ({
  text,
  boldChars,
  textSize = "text-[36px]",
}) => {
  const renderTextWithBold = () => {
    const regex = new RegExp(`(${boldChars.join("|")})`, "g");

    // Handle line breaks by splitting on \n, while still splitting for bold chars
    return text.split('\n').map((line, lineIndex) => {
      const parts = line.split(regex);

      return (
        <div key={lineIndex} className="leading-relaxed">
          {parts.map((part, index) => {
            if (boldChars.includes(part)) {
              return (
                <span key={index} className="font-bold text-[#0B4B24]">
                  {part}
                </span>
              );
            }
            return (
              <span key={index} className="text-[#0B4B24]">
                {part}
              </span>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className={`text-center ${textSize}`}>
      {renderTextWithBold()}
    </div>
  );
};

export default GreenText;