import React, { useEffect } from "react";
import YellowBox from "../../components/YellowBox";
import { useConnectAccountStore } from "./ConnectAccountStore";
import { useAudioSTTControlStore } from "../../store/AudioSTTControlStore";

import sayAccountNumber from "../../assets/audio/12_계좌번호를_말하거나_입력해주세요.mp3";
import deleteAll from "../../assets/audio/09_다_지워라고_말하면_전부_지울_수_있어요.mp3";

const AccountNumber: React.FC = () => {
  const { accountNum, setAccountNum, error, setError } =
    useConnectAccountStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountNum(e.target.value);
    setError(null);
  };

  const { setIsAudioPlaying } = useAudioSTTControlStore();

  // 오디오말하기
  const sayAccountNumberAudio = new Audio(sayAccountNumber);
  const deleteAllAudio = new Audio(deleteAll);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    setIsAudioPlaying(true)
    // sayAccountNumberAudio 먼저 플레이해
    sayAccountNumberAudio.play();

    // 계좌번호 말해주세요 메시지 먼저 말하고 끝나면 그 다음거 해
    sayAccountNumberAudio.addEventListener("ended", () => {
      deleteAllAudio.play();
    });

    deleteAllAudio.addEventListener("ended", () => {
      setIsAudioPlaying(false)
    })

    // component unmount되면 중지시키고 둘다 0으로 되돌려
    return () => {
      setIsAudioPlaying(true)
      sayAccountNumberAudio.pause();
      sayAccountNumberAudio.currentTime = 0;

      deleteAllAudio.pause();
      deleteAllAudio.currentTime = 0;
    };
  }, []);

  return (
    <div>
      <header>
        <h1 className="text-center text-[40px]">통장 등록</h1>
      </header>

      {/* 아무것도 입력안하고 넘어가려고 하면 에러페이지 띄움 */}
      {error && (
        <p className="mt-4 text-center text-[25px] font-bold text-red-500">
          {error}
        </p>
      )}

      <div className="flex w-full justify-center">
        <YellowBox>
          <div>
            <p className="mb-[20px] text-[30px] font-bold">계좌번호</p>
          </div>
          <div>
            <input
              type="number"
              value={accountNum}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 p-2 text-[35px]"
            />
          </div>
        </YellowBox>
      </div>
    </div>
  );
};

export default AccountNumber;
