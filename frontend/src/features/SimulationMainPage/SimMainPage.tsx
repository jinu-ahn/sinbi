import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import YellowButton from "../../components/YellowButton";
import avatar from "../../assets/avatar.png";
import SimMainVoiceCommand from "./SimMainVoiceCommand";
import { useSimMainStore } from "./SimMainStore";
import SpeechBubble from "../../components/SpeechBubble";

import sayConnectAccount from "../../assets/audio/10_'통장_등록'이라고_말하거나_눌러주세요.mp3";
import sayMyAccounts from "../../assets/audio/36_'모든_통장'이라고_말하거나_눌러주세요.mp3";
import saySendMoney from "../../assets/audio/19_'돈_보내기'라고_말하거나_눌러주세요.mp3";

interface ButtonConfig {
  text: string[];
  path: string;
}

const SimMainPage: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);

  const { mainStep } = useSimMainStore();

  const buttons: ButtonConfig[] = [
    { text: ["돈", "보내기"], path: "/sim-transfer" },
    { text: ["모든", "통장"], path: "/sim-account-view" },
    { text: ["통장", "등록"], path: "/sim-connect-account" },
    { text: ["배우기", "/뉴스"], path: "/sim-learn-news" },
  ];

  const handleNavigation = (path: string): void => {
    navigate(path);
  };

  const handleCloseModal = () => {
    setShowModal(false); // 모달 숨기기
  };

  // step 1 : 통장 등록
  // step 2 : 내 통장들 목록 보기
  // step 3 : 돈 보내기 (+ 즐겨찾기에서 돈 보내기)
  const stepOneText = '"통장 등록"\n이라고\n말하거나\n눌러주세요.';
  const stepOneBoldChars = ["통장 등록", "말", "눌러"];
  const stepTwoText = '"모든 통장"\n이라고\n말하거나\n눌러주세요.';
  const stepTwoBoldChars = ["모든 통장", "말", "눌러"];
  const stepThreeText = '"돈 보내기"\n이라고\n말하거나\n눌러주세요.';
  const stepThreeBoldChars = ["돈 보내기", "말", "눌러"];

  // 오디오 파일
  const sayConnectAccountAudio = new Audio(sayConnectAccount);
  const sayMyAccountsAudio = new Audio(sayMyAccounts);
  const saySendMoneyAudio = new Audio(saySendMoney);

  // 오디오 플레이
  useEffect(() => {
    if (!showModal) {
      if (mainStep === 1) {
        sayConnectAccountAudio.play();
      } else if (mainStep === 2) {
        sayMyAccountsAudio.play();
      } else if (mainStep === 3) {
        saySendMoneyAudio.play();
      }
    }

    // step 이 바뀌거나 unmount되면 초기화
    return () => {
      sayConnectAccountAudio.pause();
      sayConnectAccountAudio.currentTime = 0;
      sayMyAccountsAudio.pause();
      sayMyAccountsAudio.currentTime = 0;
      saySendMoneyAudio.pause();
      saySendMoneyAudio.currentTime = 0;
    };
  }, [mainStep, showModal]);

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
            <p className="text-[30px]">지금부터</p>
            <p className="text-[30px]">
              <span className="font-bold text-red-500">기능</span>을 하나씩
            </p>
            <p className="mb-4 text-[30px]">
              <span className="font-bold text-red-500">연습</span>해봐요!
            </p>
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

      <div className="mt-8 flex w-full justify-center">
        {/* step 따라 다른 말풍선 내용 */}
        {mainStep === 1 && (
          <SpeechBubble text={stepOneText} boldChars={stepOneBoldChars} />
        )}
        {mainStep === 2 && (
          <SpeechBubble text={stepTwoText} boldChars={stepTwoBoldChars} />
        )}
        {mainStep === 3 && (
          <SpeechBubble text={stepThreeText} boldChars={stepThreeBoldChars} />
        )}
      </div>

      <SimMainVoiceCommand />
    </div>
  );
};

export default SimMainPage;
