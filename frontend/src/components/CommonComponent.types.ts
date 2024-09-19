import { ReactNode,MouseEvent } from "react";

// Export the YellowBoxProps type so it can be used in other files
export interface YellowBoxProps {
  children: ReactNode;
}

export interface YellowButtonProps {
    children: ReactNode;
    height: number;
    width: number;
    onClick: (event?: MouseEvent<HTMLButtonElement>) => void;
}

export interface BoldTextProps {
  text: string;
  boldChars: string[];
  textSize?: string;
}