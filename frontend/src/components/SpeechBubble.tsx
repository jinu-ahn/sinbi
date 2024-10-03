import React from "react";
import GreenText from "./GreenText";
import { BoldTextProps } from "./CommonComponent.types";

const SpeechBubble: React.FC<BoldTextProps> = ({
  text,
  boldChars,
  textSize = "text-[36px]",
}) => {
  return (
    <div className="flex h-1/4 w-4/5 items-center justify-center border-2 border-[#0B4B24]">
      <GreenText text={text} boldChars={boldChars} textSize={textSize} />
    </div>
  );
};

export default SpeechBubble;
