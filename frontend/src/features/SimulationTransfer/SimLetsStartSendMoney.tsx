import React, { useEffect } from "react";
import GreenText from "../../components/GreenText";
import { useSimTransferStore } from "./SimTransferStore";
import { useAudioSTTControlStore } from "../../store/AudioSTTControlStore";

import letsStartSendMoney from "../../assets/audio/20_지금부터_돈_보내기를_같이_연습해요_걱정_마세요_가짜_돈이에요.mp3";

const SimLetsStartSendMoney: React.FC = () => {
  const firstText = "지금부터\n돈 보내기를\n같이 연습해요.";
  const firstBodlChars = ["돈 보내기", "같이 연습"];
  const secondText = "걱정 마세요!\n가짜 돈이에요.";
  const secondBoldChars = ["가짜"];

  const { setStep } = useSimTransferStore();
  const { setIsAudioPlaying } = useAudioSTTControlStore();

  // 오디오말하기
  const audio = new Audio(letsStartSendMoney);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    setIsAudioPlaying(true)
    // 플레이시켜
    audio.play();

    let timerId: ReturnType<typeof setTimeout>;

    // 오디오가 끝나고 1초 뒤 자동으로 다음 단계로 이동
    audio.addEventListener("ended", () => {
      setIsAudioPlaying(false)
      timerId = setTimeout(() => {
        setStep(1);
      }, 1000);
    });

    // 근데 component가 unmount 되면 플레이 중지! 시간 0초로 다시 되돌려
    return () => {
      setIsAudioPlaying(false)
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
      {/* 지금부터 통장 등록을 같이 시작해요. */}
      <div className="mb-10 mt-5">
        <GreenText text={firstText} boldChars={firstBodlChars} />
      </div>

      {/* 천천히 따라오세요! */}
      <div>
        <GreenText text={secondText} boldChars={secondBoldChars} />
      </div>
    </div>
  );
};

export default SimLetsStartSendMoney;
