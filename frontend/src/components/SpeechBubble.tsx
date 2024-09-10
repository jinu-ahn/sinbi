import React from "react";
import GreenText from "./GreenText";


const SpeechBubble: React.FC = () => {
  return (
    <div className="w-4/5 h-1/4 border-2 border-[#0B4B24] flex items-center justify-center">
      <GreenText text="'돈 보내기' 라고 말해주세요" boldChars={['돈 보내기']} textSize="text-[30px]" />
    </div>
  );
};

export default SpeechBubble;