import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import YellowButton from "../../components/YellowButton";
import avatar from "../../assets/avatar.png";
import MainVoiceCommand from "./MainVoiceCommand";
// import chooseFunction from "../../assets/audio/58_원하는_기능을_말하거나_눌러주세요.mp3";
import { useLearnNewsSimDoneStore } from "../../store/LearnNewsSimDoneStore";
import { useAudioSTTControlStore } from "../../store/AudioSTTControlStore";
import chooseFunction from "../../assets/audio/58_원하는_기능을_말하거나_눌러주세요.mp3";

interface ButtonConfig {
  text: string[];
  path: string;
}

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);
  const { setIsAudioPlaying } = useAudioSTTControlStore();

  const { done } = useLearnNewsSimDoneStore();

  const buttons: ButtonConfig[] = [
    { text: ["돈", "보내기"], path: "/transfer" },
    { text: ["모든", "통장"], path: "/account-view" },
    { text: ["통장", "등록"], path: "/connect-account" },
    { text: ["배우기", "/뉴스"], path: "/learn-news" },
  ];

  const handleNavigation = (path: string): void => {
    if (path === "/learn-news") {
      if (!done) {
        navigate("/sim-learn-news");
      } else {
        navigate(path);
      }
    } else {
      navigate(path);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // 모달 숨기기
  };

  const getButtonSize = () => {
    if (window.innerWidth >= 425) {
      return { height: 140, width: 160 };
    } else if (window.innerWidth >= 375) {
      return { height: 130, width: 140 };
    } else {
      return { height: 110, width: 130 };
    }
  };

  const [buttonSize, setButtonSize] = React.useState(getButtonSize());

  // 오디오말하기
  const audio = new Audio(chooseFunction);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    if (!showModal) {
      setIsAudioPlaying(true)
      // 플레이시켜
      audio.play();
      audio.addEventListener("ended", () => {
        setIsAudioPlaying(false)
      })
    }

    // 근데 component가 unmount 되면 플레이 중지! 시간 0초로 다시 되돌려
    return () => {
      setIsAudioPlaying(false)
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [showModal]);

  React.useEffect(() => {
    const handleResize = () => {
      setButtonSize(getButtonSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between py-8">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 text-center shadow-lg">
            <p className="text-[30px]">곤란하실 땐 </p>
            <p className="text-[30px] font-bold text-red-500"> '신비야'</p>
            <p className="mb-4 text-[30px]">하고 부르세요.</p>
            <button
              className="rounded-lg bg-yellow-500 px-4 py-2 text-[30px] font-bold"
              onClick={handleCloseModal}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        <div className="grid grid-cols-2 gap-6 p-2 mobile-medium:gap-8 mobile-large:gap-10">
          {buttons.map((button, index) => (
            <div key={index} className="flex items-center justify-center">
              <YellowButton
                height={buttonSize.height}
                width={buttonSize.width}
                onClick={() => handleNavigation(button.path)}
              >
                <div className="flex h-full w-full flex-col items-center justify-center leading-relaxed">
                  {button.text.map((line, lineIndex) => (
                    <p
                      key={lineIndex}
                      className="text-center text-[30px] font-bold mobile-medium:text-[35px] mobile-large:text-[40px]"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </YellowButton>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 h-[300px] w-[318px] -translate-x-1/2 transform">
        <img
          src={avatar}
          alt="Avatar"
          className="h-full w-full object-contain"
        />
      </div>

      <MainVoiceCommand />
    </div>
  );
};

export default MainPage;
