import React, { useEffect } from "react";
import GreenText from "../../components/GreenText";
import { useSimLearnNewsStore } from "./SimLearnNewsStore";
import avatar from "../../assets/avatar.png";
import { useAudioSTTControlStore } from "../../store/AudioSTTControlStore";

import letsStartLearnNews from "../../assets/audio/80_지금부터_금융_배우기랑_뉴스를_확인하러_가볼까요.mp3";

const SimLetsStartLearnNews: React.FC = () => {
  const firstText = "지금부터\n금융 배우기랑\n뉴스 확인하러\n가볼까요?";
  const firstBodlChars = ["금융 배우기", "뉴스"];
  const { setIsAudioPlaying } = useAudioSTTControlStore();

  const { setCurrentView, setCurrentLearnView, setSelectedCategory, setStep } =
    useSimLearnNewsStore();

  // 오디오말하기
  const audio = new Audio(letsStartLearnNews);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    setIsAudioPlaying(true)
    // 플레이시켜
    audio.play();

    let timerId: ReturnType<typeof setTimeout>;

    // 오디오가 끝나고 1초 뒤 자동으로 다음 단계로 이동
    audio.addEventListener("ended", () => {
      timerId = setTimeout(() => {
        setStep(1);
        setCurrentView("choice");
        setCurrentLearnView("");
        setSelectedCategory(null);
      }, 1000);
    });

    // 근데 component가 unmount 되면 플레이 중지! 시간 0초로 다시 되돌려
    return () => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
      audio.removeEventListener("ended", () => {
        clearTimeout(timerId);
      });
    };
  }, []);

  return (
    <div>
      <div className="mb-10 mt-5">
        <GreenText text={firstText} boldChars={firstBodlChars} />
      </div>

      <div className="absolute bottom-0 left-1/2 h-[204px] w-[318px] -translate-x-1/2 transform">
        <img
          src={avatar}
          alt="Avatar"
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
};

export default SimLetsStartLearnNews;
