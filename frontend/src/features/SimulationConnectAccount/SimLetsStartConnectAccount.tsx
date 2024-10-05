import React, { useEffect } from "react";
import GreenText from "../../components/GreenText";
import { useSimConnectAccountStore } from "./SimConnectAccountStore";

import letsStartConnectAccount from "../../assets/audio/11_지금부터_통장_등록을_같이_시작해요_천천히_따라오세요.mp3";

const SimLetsStart: React.FC = () => {
  const firstText = "지금부터\n통장 등록을\n같이 시작해요.";
  const firstBodlChars = ["통장 등록", "같이 시작"];
  const secondText = "천천히\n따라오세요!";
  const secondBoldChars = [""];

  const { setStep } = useSimConnectAccountStore();

  // 오디오말하기
  const audio = new Audio(letsStartConnectAccount);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    // 플레이시켜
    audio.play();

    let timerId: ReturnType<typeof setTimeout>;

    // 오디오가 끝나고 1초 뒤 자동으로 다음 단계로 이동
    audio.addEventListener("ended", () => {
      timerId = setTimeout(() => {
        setStep(1);
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

export default SimLetsStart;
