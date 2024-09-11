import React from "react";
import GreenText from "./GreenText";
import { BoldTextProps } from "./CommonComponent.types";

const SpeechBubble: React.FC<BoldTextProps> = ({ text, boldChars, textSize = "text-[36px]" }) => {
  return (
    <div className="w-4/5 h-1/4 border-2 border-[#0B4B24] flex items-center justify-center">
      <GreenText text={text} boldChars={boldChars} textSize={textSize} />
    </div>
  );
};

export default SpeechBubble;