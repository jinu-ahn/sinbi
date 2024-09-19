import React, {MouseEvent} from "react";
import { YellowButtonProps } from "./CommonComponent.types";

const YellowButton: React.FC<YellowButtonProps> = ({
  children,
  height,
  width,
  onClick
}) => {
  // const handleClick = () => {
  //   console.log("YellowButton clicked");
  //   onClick();
  // };
  console.log("YellowButton rendered", { height, width });
  return (
    <button
      style={{ height: `${height}px`, width: `${width}px` }}
      className={`bg-[#FFC700] p-4 rounded-md`}
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        console.log("YellowButton clicked"); // 클릭 이벤트 확인 로그
        onClick(e);
      }}
    >
      {children}
    </button>
  );
};

export default YellowButton;
