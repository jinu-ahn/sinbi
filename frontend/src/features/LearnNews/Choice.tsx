import React, { useEffect, useState } from "react";
import YellowButton from "../../components/YellowButton";
import { useLearnNewsStore } from "./useLearnNewsStore";
import { useNavigate } from "react-router-dom";
import Avatar from "../../assets/avatar.png";

// HomeIcon 컴포넌트
const HomeIcon: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate('/main')}
      className="flex h-20 w-20 items-center justify-center rounded-lg bg-yellow-400 hover:bg-yellow-500 transition-colors duration-200"
    >
      <div className="text-2xl font-bold">
        처음
        <br />
        으로
      </div>
    </button>
  );
};

const Choice: React.FC = () => {
  const { setCurrentView } = useLearnNewsStore();

  // 화면 크기에 따른 버튼 크기를 결정하는 함수
  const getButtonSize = () => {
    if (window.innerWidth >= 425) {
      return { height: 140, width: 160 };
    } else if (window.innerWidth >= 375) {
      return { height: 130, width: 140 };
    } else {
      return { height: 110, width: 130 };
    }
  };

  const [buttonSize, setButtonSize] = useState(getButtonSize());

  useEffect(() => {
    const handleResize = () => {
      setButtonSize(getButtonSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <HomeIcon />
      <div className="grid grid-cols-2 gap-6 p-2 mobile-medium:gap-8 mobile-large:gap-10">
        <div className="flex items-center justify-center">
          <YellowButton
            height={buttonSize.height}
            width={buttonSize.width}
            onClick={() => setCurrentView("learn")}
          >
            <div className="flex h-full w-full flex-col items-center justify-center leading-relaxed">
              <p className="text-center text-[30px] font-bold mobile-medium:text-[35px] mobile-large:text-[40px]">
                금융
              </p>
              <p className="text-center text-[30px] font-bold mobile-medium:text-[35px] mobile-large:text-[40px]">
                배우기
              </p>
            </div>
          </YellowButton>
        </div>
        <div className="flex items-center justify-center">
          <YellowButton
            height={buttonSize.height}
            width={buttonSize.width}
            onClick={() => setCurrentView("news")}
          >
            <div className="flex h-full w-full flex-col items-center justify-center leading-relaxed">
              <p className="text-center text-[30px] font-bold mobile-medium:text-[35px] mobile-large:text-[40px]">
                뉴스
              </p>
            </div>
          </YellowButton>
        </div>
      </div>
      <img src={Avatar} alt="Avatar" className="w-24 h-24" />
    </div>
  );
};

export default Choice;