import React, { useEffect, useState } from "react";
import YellowButton from "../../components/YellowButton";
import { useLearnNewsStore } from "./useLearnNewsStore";
import { useAudioSTTControlStore } from "../../store/AudioSTTControlStore";
// import { useNavigate } from "react-router-dom";
import Avatar from "../../assets/avatar.png";
import sayChooseFunction from "../../assets/audio/58_원하는_기능을_말하거나_눌러주세요.mp3";

// HomeIcon 컴포넌트
// const HomeIcon: React.FC = () => {
//   const navigate = useNavigate();

//   return (
//     <button
//       onClick={() => navigate("/main")}
//       className="flex h-20 w-20 items-center justify-center rounded-lg bg-yellow-400 transition-colors duration-200 hover:bg-yellow-500"
//     >
//       <div className="text-2xl font-bold">
//         처음
//         <br />
//         으로
//       </div>
//     </button>
//   );
// };

const Choice: React.FC = () => {
  const { setCurrentView } = useLearnNewsStore();
  const { setIsAudioPlaying } = useAudioSTTControlStore();

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

  // 오디오말하기
  const sayChooseFunctionAudio = new Audio(sayChooseFunction);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    setIsAudioPlaying(true)
    // 플레이시켜
    sayChooseFunctionAudio.play();

    sayChooseFunctionAudio.addEventListener("ended", () => {
      setIsAudioPlaying(false)
    })

    // 근데 component가 unmount 되면 플레이 중지! 시간 0초로 다시 되돌려
    return () => {
      setIsAudioPlaying(true)
      if (!sayChooseFunctionAudio.paused) {
        sayChooseFunctionAudio.pause();
        sayChooseFunctionAudio.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setButtonSize(getButtonSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* <HomeIcon /> */}
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
      <div className="absolute bottom-0 left-1/2 h-[204px] w-[318px] -translate-x-1/2 transform">
        <img
          src={Avatar}
          alt="Avatar"
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
};

export default Choice;
