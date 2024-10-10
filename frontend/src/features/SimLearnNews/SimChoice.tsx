import React, { useEffect, useState } from "react";
import YellowButton from "../../components/YellowButton";
import { useSimLearnNewsStore } from "./SimLearnNewsStore";
import Avatar from "../../assets/avatar.png";
import SpeechBubble from "../../components/SpeechBubble";
import SimLearnNewsVoiceCommand from "./SimLearnNewsVoiceCommand";
import { useNavigate } from "react-router-dom";
import { useLearnNewsSimDoneStore } from "../../store/LearnNewsSimDoneStore";
import { useAudioSTTControlStore } from "../../store/AudioSTTControlStore";

import sayLearnFirst from "../../assets/audio/81_여기서는_금융_지식을_배우거나_뉴스를_들을_수_있어요_우선은_금융_배우기.mp3";
import learnNews from "../../assets/audio/45_이제_뉴스_기능을_배워봐요.mp3";
import sayNews from "../../assets/audio/46_뉴스라고_말해보세요.mp3";
import learnDone from "../../assets/audio/84_배우기가_끝났어요_신비와_함께_지식을_늘려나가요.mp3";

const SimChoice: React.FC = () => {
  const { setCurrentView, setStep, step } = useSimLearnNewsStore();
  const { setDone } = useLearnNewsSimDoneStore();
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

  const navigate = useNavigate();

  const [buttonSize, setButtonSize] = useState(getButtonSize());

  const firstText = '"금융 배우기"\n라고\n말해보세요.';
  const firstBoldChars = ["금융 배우기", "말"];

  const secondText = '"뉴스"\n라고\n말해보세요.';
  const secondBoldChars = ["뉴스", "말"];

  const thirdText = "배우기 끝!\n신비와 함께\n지식을\n늘려나가요!";
  const thirdBoldChars = ["지식", "끝"];

  // step 1, 7, 10에 따라 각각 다른 오디오 플레이
  useEffect(() => {
    let audio: HTMLAudioElement | null = null;

    if (step === 1) {
      setIsAudioPlaying(true)
      audio = new Audio(sayLearnFirst);
      audio.play();
      audio.addEventListener("ended", () => {
        setIsAudioPlaying(false)
      })
    } else if (step === 7) {
      setIsAudioPlaying(true)
      audio = new Audio(learnNews);
      audio.play();
      audio.addEventListener("ended", () => {
        const sayNewsAudio = new Audio(sayNews);
        sayNewsAudio.play();
        sayNewsAudio.addEventListener("ended", () => {
          setIsAudioPlaying(false)
        })
      });
    } else if (step === 10) {
      setIsAudioPlaying(true)
      audio = new Audio(learnDone);
      audio.play();
      audio.addEventListener("ended", () => {
        setTimeout(() => {
          navigate("/learn-news");
          setDone(true);
        }, 1000);
      });
    }

    // unmount되면 중지시켜
    return () => {
      setIsAudioPlaying(true)
      if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [step]);

  useEffect(() => {
    const handleResize = () => {
      setButtonSize(getButtonSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleGoLearn = () => {
    setCurrentView("learn");
    setStep(step + 1);
  };

  const handleGoNews = () => {
    setCurrentView("news");
    setStep(step + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="grid grid-cols-2 gap-6 p-2 mobile-medium:gap-8 mobile-large:gap-10">
        <div className="flex items-center justify-center">
          <YellowButton
            height={buttonSize.height}
            width={buttonSize.width}
            onClick={handleGoLearn}
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
            onClick={handleGoNews}
          >
            <div className="flex h-full w-full flex-col items-center justify-center leading-relaxed">
              <p className="text-center text-[30px] font-bold mobile-medium:text-[35px] mobile-large:text-[40px]">
                뉴스
              </p>
            </div>
          </YellowButton>
        </div>
      </div>

      <div className="mt-8 flex w-full justify-center">
        {/* Update text and bold characters based on the step */}
        {step === 1 ? (
          <SpeechBubble text={firstText} boldChars={firstBoldChars} />
        ) : step === 7 ? (
          <SpeechBubble text={secondText} boldChars={secondBoldChars} />
        ) : step === 10 ? (
          <SpeechBubble text={thirdText} boldChars={thirdBoldChars} />
        ) : null}
      </div>

      <div className="absolute bottom-0 left-1/2 z-10 h-[204px] w-[318px] -translate-x-1/2 transform">
        <img
          src={Avatar}
          alt="Avatar"
          className="h-full w-full object-contain"
        />
      </div>

      <SimLearnNewsVoiceCommand />
    </div>
  );
};

export default SimChoice;
