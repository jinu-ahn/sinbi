// UserLayout.tsx
import React, { ReactNode } from "react";
import avatar from '../../assets/avatar_img.png';
import SpeechBubble from "../../components/SpeechBubble";

interface UserLayoutProps {
  children: ReactNode;
  speechBubbleText: string;
  speechBubbleBoldChars: string[];
}

const UserLayout: React.FC<UserLayoutProps> = ({ children, speechBubbleText, speechBubbleBoldChars }) => {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen py-8 relative bg-white">
      <div className="w-full max-w-md">
        {children}
      </div>
      
      <SpeechBubble 
        text={speechBubbleText}
        boldChars={speechBubbleBoldChars}
        textSize="text-[20px] mobile-medium:text-[24px] mobile-large:text-[28px]"
      />

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[318px] h-[204px]">
        <img
          src={avatar}
          alt="Avatar"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default UserLayout;