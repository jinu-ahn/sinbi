import React from "react";
import { YellowBoxProps } from "./CommonComponent.types";


const YellowBox: React.FC<YellowBoxProps> = ({ children }) => {
  return (
    <div className="w-4/5 flex flex-col bg-[#FFC700] h-1/2 items-center justify-center text-center p-4 m-4">
      {children}
    </div>
  );
};

export default YellowBox;