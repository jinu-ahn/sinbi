import React from "react";
import { YellowBoxProps } from "./CommonComponent.types";

const YellowBox: React.FC<YellowBoxProps> = ({ children }) => {
  return (
    <div className="m-4 flex h-1/2 w-4/5 flex-col items-center justify-center bg-[#FFE174] p-4 text-center">
      {children}
    </div>
  );
};

export default YellowBox;