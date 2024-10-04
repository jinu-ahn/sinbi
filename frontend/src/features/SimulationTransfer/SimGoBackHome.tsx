import React, { useEffect } from "react";
import { useSimTransferStore } from "./SimTransferStore";
import { useNavigate } from "react-router-dom";
import GreenText from "../../components/GreenText";
import YellowBox from "../../components/YellowBox";

import letsGoHome from "../../assets/audio/78_필요하신_기능을_모두_배웠어요_이제_시작_화면으로_돌아갈게요.mp3";

const SimGoBackHome: React.FC = () => {
  const { setNickName } = useSimTransferStore();
  const boldChars = ["집"];
  const text = "필요하신 기능을\n모두 배웠어요!\n이제 집으로\n돌아갈게요.";

  const navigate = useNavigate();

  // 오디오말하기
  const audio = new Audio(letsGoHome);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    // 플레이시켜
    audio.play();

    audio.addEventListener("ended", () => {
      setTimeout(() => {
        setNickName("");
        navigate("/");
      }, 1000);
    });

    // 근데 component가 unmount 되면 플레이 중지! 시간 0초로 다시 되돌려
    return () => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
      audio.removeEventListener("ended", () => {});
    };
  }, [navigate]);

  return (
    <div className="mt-[80px] flex items-center justify-center">
      <YellowBox>
        <GreenText
          textSize="text-[30px]"
          text={text}
          boldChars={boldChars}
        ></GreenText>
      </YellowBox>
    </div>
  );
};

export default SimGoBackHome;
