import React, { useEffect } from "react";
import YellowBox from "../../components/YellowBox";
import { useConnectAccountStore } from "./ConnectAccountStore";
import bankLogos from "../../assets/bankLogos";
import defaultBankLogo from "../../assets/defaultBankLogo.png";
import { useAudioSTTControlStore } from "../../store/AudioSTTControlStore";

import isThisAccountRight from "../../assets/audio/15_이_계좌가_맞나요.mp3";
import anErrorOccurred from "../../assets/audio/14_해당하는_계좌가_없어요_다시_한번_확인해주세요.mp3";
import goBack from "../../assets/audio/05_뒤로_가려면_이전이라고_말해주세요.mp3";

const AccountCheck: React.FC = () => {
  const { bankType, accountNum, error } = useConnectAccountStore();
  const banks = [
    { id: "IBK", name: "IBK기업은행", logo: bankLogos["IBK기업은행"] },
    { id: "KB", name: "국민은행", logo: bankLogos["KB국민은행"] },
    { id: "KDB", name: "KDB산업은행", logo: bankLogos["KDB산업은행"] },
    { id: "KEB", name: "KEB외환은행", logo: bankLogos["KEB외환은행"] },
    { id: "NH", name: "NH농협은행", logo: bankLogos["NH농협은행"] },
    { id: "SBI", name: "SBI저축은행", logo: bankLogos["SBI저축은행"] },
    { id: "SC", name: "SC제일은행", logo: bankLogos["SC제일은행"] },
    { id: "KYUNGNAM", name: "경남은행", logo: bankLogos["경남은행"] },
    { id: "GWANJU", name: "광주은행", logo: bankLogos["광주은행"] },
    { id: "DAEGU", name: "대구은행", logo: bankLogos["대구은행"] },
    { id: "BUSAN", name: "부산은행", logo: bankLogos["부산은행"] },
    { id: "SANLIM", name: "산림조합", logo: bankLogos["산림조합"] },
    { id: "SAEMAEUL", name: "새마을은행", logo: bankLogos["새마을은행"] },
    { id: "SUHYUB", name: "수협은행", logo: bankLogos["수협은행"] },
    { id: "SHINHAN", name: "신한은행", logo: bankLogos["신한은행"] },
    { id: "SHINHYUB", name: "신협은행", logo: bankLogos["신협은행"] },
    { id: "CITY", name: "씨티은행", logo: bankLogos["씨티은행"] },
    { id: "WOORI", name: "우리은행", logo: bankLogos["우리은행"] },
    { id: "POSTBANK", name: "우체국은행", logo: bankLogos["우체국은행"] },
    { id: "JYOCHUK", name: "저축은행", logo: bankLogos["저축은행"] },
    { id: "JYUNBUK", name: "전북은행", logo: bankLogos["전북은행"] },
    { id: "JEJU", name: "제주은행", logo: bankLogos["제주은행"] },
    { id: "KAKAO", name: "카카오뱅크", logo: bankLogos["카카오뱅크"] },
    { id: "TOSS", name: "토스뱅크", logo: bankLogos["토스뱅크"] },
    { id: "HANA", name: "하나은행", logo: bankLogos["하나은행"] },
    { id: "HANKUKTUZA", name: "한국투자증권", logo: bankLogos["한국투자증권"] },
  ];

  const { setIsAudioPlaying } = useAudioSTTControlStore();

  const selectedBank = banks.find((bank) => bank.id === bankType) || {
    id: "BASIC",
    name: "기본은행",
    logo: defaultBankLogo,
  };

  // 오디오말하기
  const isThisAccountRightaudio = new Audio(isThisAccountRight);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    if (!error) {
      setIsAudioPlaying(true)
      // 플레이시켜
      isThisAccountRightaudio.play();

      isThisAccountRightaudio.addEventListener("ended", () => {
        setIsAudioPlaying(false)
      })
    }

    // 근데 component가 unmount 되면 플레이 중지! 시간 0초로 다시 되돌려
    return () => {
      if (!isThisAccountRightaudio.paused) {
        setIsAudioPlaying(true)
        isThisAccountRightaudio.pause();
        isThisAccountRightaudio.currentTime = 0;
      }
    };
  }, [error]);

  // 에러났으면 플레이할 오디오
  useEffect(() => {
    if (error) {
      setIsAudioPlaying(true)
      
      const errorAudio = new Audio(anErrorOccurred);
      const backAudio = new Audio(goBack);

      errorAudio.play();

      errorAudio.addEventListener("ended", () => {
        backAudio.play();
      });

      backAudio.addEventListener("ended", () => {
        setIsAudioPlaying(false)
      })

      // 근데 component가 unmount 되면 플레이 중지! 시간 0초로 다시 되돌려
      return () => {
        setIsAudioPlaying(true)

        if (!errorAudio.paused) {
          errorAudio.pause();
          errorAudio.currentTime = 0;
        }
        if (!backAudio.paused) {
          backAudio.pause();
          backAudio.currentTime = 0;
        }
      };
    }
  }, [error]);

  return (
    <div>
      <header>
        <h1 className="text-center text-[40px]">통장 확인</h1>
      </header>

      {/* 아무것도 입력안하고 넘어가려고 하면 에러페이지 띄움 */}
      {error && (
        <p className="mt-4 text-center text-[25px] font-bold text-red-500">
          {error}
        </p>
      )}

      <div className="mt-4 flex w-[350px] justify-center">
        <YellowBox>
          {/* 은행 로고와 이름 */}
          <div className="flex items-center space-x-4">
            {selectedBank && (
              <>
                <img
                  src={selectedBank.logo}
                  alt={selectedBank.name}
                  className="h-10 w-10"
                />
                <p className="text-[30px] font-bold">{selectedBank.name}</p>
              </>
            )}
          </div>

          {/* 계좌번호 */}
          <div>
            <p className="text-[30px] font-bold">{accountNum}</p>
          </div>
        </YellowBox>
      </div>
    </div>
  );
};

export default AccountCheck;
