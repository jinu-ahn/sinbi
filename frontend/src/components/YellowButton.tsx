import React from "react";
import { YellowButtonProps } from "./CommonComponent.types";

const YellowButton: React.FC<YellowButtonProps> = ({
  children,
  height,
  width,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      style={{ height: `${height}px`, width: `${width}px` }}
      className={`rounded-md bg-[#FFC700] p-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75`}
    >
      {children}
    </button>
  );
};

export default YellowButton;
