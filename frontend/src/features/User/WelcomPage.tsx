import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import GreenText from "../../components/GreenText";
import YellowButton from "../../components/YellowButton";
import isFirstTTS from "../../assets/audio/54_저희_은행_비서가_처음이신가요.mp3";

import useUserStore from "./useUserStore";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const getButtonSize = () => {
    if (window.innerWidth >= 425) {
      return { height: 90, width: 330 };
    } else if (window.innerWidth >= 375) {
      return { height: 80, width: 275 };
    } else {
      return { height: 70, width: 230 };
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

  // 오디오말하기
  useEffect(() => {
    audioRef.current = new Audio(isFirstTTS);
  }, []);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    // 플레이시켜
    // 사용자가 상호작용했고 모달이 닫혔을 때만 오디오 재생
    if (hasInteracted && !showModal) {
      audioRef.current?.play();
    }

    // 근데 component가 unmount 되면 플레이 중지! 시간 0초로 다시 되돌려
    return () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [hasInteracted, showModal]);

  const handleCloseModal = () => {
    setShowModal(false); // 모달 숨기기
    setHasInteracted(true); // 사용자 상호작용 표시
  };

  return (
    <>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 text-center shadow-lg">
            <p className="text-[30px]">볼륨 조절 후 </p>
            <p className="text-[30px] font-bold text-red-500"> '확인'</p>
            <p className="mb-4 text-[30px]">눌러주세요.</p>
            <button
              className="rounded-lg bg-yellow-500 px-4 py-2 text-[30px] font-bold"
              onClick={handleCloseModal}
            >
              확인
            </button>
          </div>
        </div>
      )}
      <div className="flex min-h-screen flex-col items-center justify-center">
        <GreenText text="저희 은행 비서가" boldChars={[""]} />
        <GreenText text="처음이신가요?" boldChars={["처음"]} />
        <div className="mt-8 flex flex-col items-center space-y-6 mobile-large:space-y-8">
          <YellowButton
            height={buttonSize.height}
            width={buttonSize.width}
            onClick={() => navigate("/signup")}
          >
            <div className="flex h-full w-full flex-col items-center justify-center leading-relaxed">
              <p className="text-center text-[26px] font-bold mobile-medium:text-[31px] mobile-large:text-[36px]">
                네, 처음이에요
              </p>
            </div>
          </YellowButton>
          <YellowButton
            height={buttonSize.height}
            width={buttonSize.width}
            onClick={() => navigate("/login")}
          >
            <div className="flex h-full w-full flex-col items-center justify-center leading-relaxed">
              <p className="text-center text-[26px] font-bold mobile-medium:text-[31px] mobile-large:text-[36px]">
                아니요, 해봤어요
              </p>
            </div>
          </YellowButton>
        </div>
      </div>
    </>
  );
};

export default WelcomePage;
