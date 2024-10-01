import React from "react";
import { YellowButtonProps } from "../../components/CommonComponent.types";
import GreenText from "../../components/GreenText";

interface CustomButtonProps extends Omit<YellowButtonProps, 'children'> {
  text:string[];
  textSize?: string;

}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  height,
  width,
  onClick,
  textSize = "text-[30px]",
}) => {
  return (
    <button
      onClick={onClick}
      style={{ height: `${height}px`, width: `${width}px` }}
      className="p-0 bg-white border border-[#0B4B24] rounded text-[15px]"
    >
      {text.map((line, index) => (
          <GreenText 
            key={index} 
            text={line} 
            boldChars={[]} 
            textSize={textSize} 
          />
        ))}
    </button>
  );
};

export default CustomButton;