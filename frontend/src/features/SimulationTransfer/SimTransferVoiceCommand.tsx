import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useNavigate } from "react-router-dom";
import { useSimTransferStore } from "./SimTransferStore";

// 목소리 오디오
import pickMyBankAccount from "../../assets/audio/22_어느_통장에서_돈을_보낼까요_하나를_골라_눌러주세요.mp3";
import sendToWho from "../../assets/audio/31_누구에게_보낼지_말하거나_눌러주세요_없으면_새로운_계좌라고_말하세요.mp3";
import sayAccountNum from "../../assets/audio/12_계좌번호를_말하거나_입력해주세요.mp3";
import continueOrNot from "../../assets/audio/59_계속하고_싶으면_'알았어'_뒤로_가고_싶으면_'이전'이라고_말해주세요.mp3";
import sendHowMuch from "../../assets/audio/25_얼마를_보낼지_말해주세요.mp3";
import sayYesOrNo from "../../assets/audio/08_좋으면_응_싫으면_아니_라고_말해주세요.mp3";
import sayNext from "../../assets/audio/06_다음으로_넘어가려면_다음이라고_말해주세요.mp3";
import whatNickname from "../../assets/audio/29_무슨_이름으로_기억할까요.mp3";

const SimTransferVoiceCommand: React.FC = () => {
  const navigate = useNavigate();

  // 오디오말하기
  const playAudio = (audioFile: string) => {
    const audio = new Audio(audioFile);
    audio.play();
  };

  // Store에서 필요한거 전부 import!!
  const {
    step,
    setStep,
    setNickName,
    setError,
    myAccountId,
    sendAccountNum,
    setSendAccountNum,
    sendBankType,
    setSendBankType,
    money,
    setSendMoney,
    favAccounts,
    setFormalName,
    favAccountId,
    setFavAccountId,
  } = useSimTransferStore();

  const { transcript, resetTranscript } = useSpeechRecognition();
  const [previousAccountNum, setPreviousAccountNum] = useState(sendAccountNum);
  const [previousMoney, setpreviousMoney] = useState(money);

  // 사용자가 뭐라하는지 계속 들어
  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true, language: "ko-KR" });
    return () => {
      SpeechRecognition.stopListening();
    };
  }, []);

  // 사용자가 뭐라 더 말할때마다 (transcript가 바뀔때마다)
  // handleVoiceCommand에 집어넣어 (전부 lowercase로 바꿔줌)
  useEffect(() => {
    handleVoiceCommands(transcript);
    console.log("Transcript: ", transcript);
  }, [transcript]);

  // transcript 전부 lowercase로 바꿔 (include로 키워드 찾을때 안걸리는 애들이 없도록 - 근데 사실 우린 한국어라 필요없긴해...)
  const handleVoiceCommands = (transcript: string) => {
    const lowerCaseTranscript = transcript.toLowerCase();

  // 함수같은건 필요없어.. 걍 가짜로 만들어서 버튼만 누르게 만들면 됨
  // step 0 : 지금부터 돈 보내기를 같이 연습해요. 걱정 마세요! 가짜 돈이에요.
  // step 1 : 처음 = 내 통장 목록 띄우기 (가짜통장 1개)
  // step 1 : 회귀 = 지금부터 자주 보내는 계좌로 돈 보내기를 같이 연습해요.
  // step 2 : 처음 = 즐겨찾는 계좌 목록 띄우기 (아직 아무것도 없음)
  // step 2 : 회귀 = 즐겨찾는 계좌 목록 띄우기 (이제 생김)
  // step 3 : 받을 사람 계좌번호 입력 (내가 알려줘)
  // step 4 : 받을 사람 은행 입력 (여기서 그 사람이 존재하는지 체크 sendVirtualAccount) (내가 알려줘)
  // step 5 : 얼마 보낼건지 입력 (내가 알려줘)
  // step 6 : 경고창 띄워주기
  // step 7 : 진짜 보낼거냐고 묻기 (응 / 예 들으면 여기서 이체)
  // step 8 : 보냈어요 페이지
  // step 9 : 다음에 또 보낼거냐고 묻기 ( 무조건 예 하게 만들어 )
  // step 10 : 즐겨찾기 계좌에 뭐라고 등록하는지 묻기 (뭐라고 등록할지 내가 알려줘)
  // step 11 : 즐겨찾기 계좌에 은행 비서 (신비) 를 추가했어요. (자동으로 넘어감)
  // step 12 : 즐겨찾기 계좌로 돈을 보내봐요 소개페이지 (자동으로 넘어감)
  // step 13 : 즐겨찾기 계좌 목록이에요. '은행 비서'를 선택하세요.
  // step 14 : 얼마 보낼까요?
  // step 15 : 진짜 보내요?
  // step 16 : 보냈어요.
  // step 17 : 집에 갑시다

    if (step === 1) {
      if (
        lowerCaseTranscript.includes("응") ||
        lowerCaseTranscript.includes("다음")
      ) {
        if (!myAccountId) {
          setError("돈 보낼 통장을 고르세요.");
        } else {
          setError(null);
          setStep(step + 1);
        }
        resetTranscript();
      }
      if (
        lowerCaseTranscript.includes("신비") ||
        lowerCaseTranscript.includes("도와줘")
      ) {
        playAudio(pickMyBankAccount);
        resetTranscript();
      }
    } else if (step === 2) {
      setError(null);
      if (
        lowerCaseTranscript.includes("새로운") ||
        lowerCaseTranscript.includes("새 계좌")
      ) {
        setError(null);
        setStep(step + 1);
        resetTranscript();
      }
      if (
        lowerCaseTranscript.includes("신비") ||
        lowerCaseTranscript.includes("도와줘")
      ) {
        playAudio(sendToWho);
        resetTranscript();
      }

      // 기존에 존재하는 즐겨찾기 계좌 중에 하나를 골랐다면
      const matchedAccount = favAccounts.find(
        (account) =>
          lowerCaseTranscript.includes(account.recvAlias?.toLowerCase()) ||
          lowerCaseTranscript.includes(account.recvName?.toLowerCase()),
      );

      if (matchedAccount) {
        setFavAccountId(matchedAccount.id);
        setSendAccountNum(matchedAccount.recvAccountNum);
        setSendBankType(matchedAccount.bankType);
        setFormalName(matchedAccount.recvName);
        resetTranscript();
        setStep(step + 3);
      }

      if (
        lowerCaseTranscript.includes("뒤로가") ||
        lowerCaseTranscript.includes("이전")
      ) {
        setStep(step - 1);
        resetTranscript();
      }
    } else if (step === 3) {
      // "다 지워" 하면 accountNum 싹다 지워
      const accountNumberMatch = transcript.match(/\d+/g);
      if (accountNumberMatch) {
        setSendAccountNum(previousAccountNum + accountNumberMatch.join(""));
      }
      if (lowerCaseTranscript.includes("다 지워")) {
        setSendAccountNum("");
        setPreviousAccountNum("");
        resetTranscript();
      }
      if (lowerCaseTranscript.includes("하나 지워")) {
        setPreviousAccountNum(sendAccountNum.slice(0, -1));
        setSendAccountNum(sendAccountNum.slice(0, -1));
        resetTranscript();
      }

      if (
        lowerCaseTranscript.includes("응") ||
        lowerCaseTranscript.includes("다음")
      ) {
        if (!sendAccountNum) {
          setError("계좌번호를 입력하세요.");
        } else {
          setError(null);
          setStep(step + 1);
        }
        resetTranscript();
      } else if (
        lowerCaseTranscript.includes("뒤로가") ||
        lowerCaseTranscript.includes("이전")
      ) {
        setError(null);
        setStep(step - 1);
        resetTranscript();
      }
      if (
        lowerCaseTranscript.includes("신비") ||
        lowerCaseTranscript.includes("도와줘")
      ) {
        playAudio(sayAccountNum);
        resetTranscript();
      }
    } else if (step === 4) {
      if (
        lowerCaseTranscript.includes("아이비케이") ||
        lowerCaseTranscript.includes("기업")
      ) {
        setSendBankType("IBK");
      } else if (lowerCaseTranscript.includes("신비")) {
        setSendBankType("SINBI");
      } else if (
        lowerCaseTranscript.includes("케이비") ||
        lowerCaseTranscript.includes("국민")
      ) {
        setSendBankType("KB");
      } else if (
        lowerCaseTranscript.includes("케이디비") ||
        lowerCaseTranscript.includes("산업")
      ) {
        setSendBankType("KDB");
      } else if (
        lowerCaseTranscript.includes("케이이비") ||
        lowerCaseTranscript.includes("외환")
      ) {
        setSendBankType("KEB");
      } else if (
        lowerCaseTranscript.includes("엔에이치") ||
        lowerCaseTranscript.includes("농협")
      ) {
        setSendBankType("NH");
      } else if (
        lowerCaseTranscript.includes("에스비아이") ||
        lowerCaseTranscript.includes("에스비아이저축")
      ) {
        setSendBankType("SBI");
      } else if (
        lowerCaseTranscript.includes("에스씨") ||
        lowerCaseTranscript.includes("제일")
      ) {
        setSendBankType("SC");
      } else if (lowerCaseTranscript.includes("경남")) {
        setSendBankType("KYUNGNAM");
      } else if (lowerCaseTranscript.includes("광주")) {
        setSendBankType("GWANJU");
      } else if (lowerCaseTranscript.includes("대구")) {
        setSendBankType("DAEGU");
      } else if (lowerCaseTranscript.includes("부산")) {
        setSendBankType("BUSAN");
      } else if (lowerCaseTranscript.includes("산림조합")) {
        setSendBankType("SANLIM");
      } else if (lowerCaseTranscript.includes("새마을")) {
        setSendBankType("SAEMAEUL");
      } else if (lowerCaseTranscript.includes("수협")) {
        setSendBankType("SUHYUB");
      } else if (lowerCaseTranscript.includes("신한")) {
        setSendBankType("SHINHAN");
      } else if (lowerCaseTranscript.includes("신협")) {
        setSendBankType("SHINHYUB");
      } else if (lowerCaseTranscript.includes("씨티")) {
        setSendBankType("CITY");
      } else if (lowerCaseTranscript.includes("우리")) {
        setSendBankType("WOORI");
      } else if (lowerCaseTranscript.includes("우체국")) {
        setSendBankType("POSTBANK");
      } else if (lowerCaseTranscript.includes("저축")) {
        setSendBankType("JYOCHUK");
      } else if (lowerCaseTranscript.includes("전북")) {
        setSendBankType("JYUNBUK");
      } else if (lowerCaseTranscript.includes("제주")) {
        setSendBankType("JEJU");
      } else if (lowerCaseTranscript.includes("카카오")) {
        setSendBankType("KAKAO");
      } else if (lowerCaseTranscript.includes("토스")) {
        setSendBankType("TOSS");
      } else if (lowerCaseTranscript.includes("하나")) {
        setSendBankType("HANA");
      } else if (lowerCaseTranscript.includes("한국투자증권")) {
        setSendBankType("HANKUKTUZA");
      }

      if (
        lowerCaseTranscript.includes("응") ||
        lowerCaseTranscript.includes("다음")
      ) {
        if (!sendBankType) {
          setError("은행을 고르세요.");
        } else {
          setFormalName("신비");
          setError(null);
          setStep(step + 1);
          resetTranscript();
        }
      } else if (
        lowerCaseTranscript.includes("뒤로가") ||
        lowerCaseTranscript.includes("이전")
      ) {
        setError(null);
        setStep(step - 1);
        resetTranscript();
      }
    } else if (step === 5) {
      // "다 지워" 하면 싹다 지워
      const moneyMatch = transcript.match(/\d+/g);
      if (moneyMatch) {
        setSendMoney(previousMoney + moneyMatch.join(""));
      }
      if (lowerCaseTranscript.includes("다 지워")) {
        setSendMoney("");
        setpreviousMoney("");
        resetTranscript();
      }
      if (lowerCaseTranscript.includes("하나 지워")) {
        setpreviousMoney(money.slice(0, -1));
        setSendMoney(money.slice(0, -1));
        resetTranscript();
      }

      if (
        lowerCaseTranscript.includes("응") ||
        lowerCaseTranscript.includes("다음")
      ) {
        if (!money) {
          setError("얼마 보낼지 알려주세요.");
        } else {
          setError(null);
          setStep(step + 1);
        }
        resetTranscript();
      }
      if (lowerCaseTranscript.includes("이전")) {
        setError(null);
        resetTranscript();
        if (favAccountId !== 0) {
          setFavAccountId(0);
          setFormalName("");
          setSendAccountNum("");
          setSendAccountNum("");
          setStep(step - 3);
        } else {
          setStep(step - 1);
        }
      }
      if (
        lowerCaseTranscript.includes("신비") ||
        lowerCaseTranscript.includes("도와줘")
      ) {
        playAudio(sendHowMuch);
        resetTranscript();
      }
    } else if (step === 6) {
      if (
        lowerCaseTranscript.includes("알았어") ||
        lowerCaseTranscript.includes("응") ||
        lowerCaseTranscript.includes("다음")
      ) {
        resetTranscript();
        setStep(step + 1);
      }
      if (
        lowerCaseTranscript.includes("이전") ||
        lowerCaseTranscript.includes("돌아갈래") ||
        lowerCaseTranscript.includes("안 보낼래")
      ) {
        resetTranscript();
        setStep(step - 1);
      }

      if (
        lowerCaseTranscript.includes("신비") ||
        lowerCaseTranscript.includes("도와줘")
      ) {
        playAudio(continueOrNot);
        resetTranscript();
      }
    } else if (step === 7) {
      if (
        lowerCaseTranscript.includes("보내") ||
        lowerCaseTranscript.includes("응") ||
        lowerCaseTranscript.includes("다음")
      ) {
        setStep(step + 1)
        resetTranscript();
      }
      if (
        lowerCaseTranscript.includes("아니") ||
        lowerCaseTranscript.includes("이전")
      ) {
        setFormalName("");
        setSendAccountNum("");
        setSendBankType("");
        setSendMoney("");
        resetTranscript();
        setStep(1);
      }
      if (
        lowerCaseTranscript.includes("신비") ||
        lowerCaseTranscript.includes("도와줘")
      ) {
        playAudio(sayYesOrNo);
        resetTranscript();
      }
    } else if (step === 8) {
      if (
        lowerCaseTranscript.includes("알겠어") ||
        lowerCaseTranscript.includes("다음")
      ) {
        setStep(step + 1);
      }
      if (
        lowerCaseTranscript.includes("신비") ||
        lowerCaseTranscript.includes("도와줘")
      ) {
        playAudio(sayNext);
        resetTranscript();
      }
    } else if (step === 9) {
      if (
        lowerCaseTranscript.includes("응") ||
        lowerCaseTranscript.includes("네")
      ) {
        setStep(step + 1);
        resetTranscript();
      }
      if (
        lowerCaseTranscript.includes("신비") ||
        lowerCaseTranscript.includes("도와줘")
      ) {
        playAudio(sayYesOrNo);
        resetTranscript();
      }
    } else if (step === 10) {
      if (lowerCaseTranscript.includes("다 지워")) {
        setNickName("");
        resetTranscript();
      } else {
        setNickName(transcript);
      }
      if (lowerCaseTranscript.includes("다음")) {
        setStep(step + 1)
      }
      if (
        lowerCaseTranscript.includes("신비") ||
        lowerCaseTranscript.includes("도와줘")
      ) {
        playAudio(whatNickname);
        resetTranscript();
      }
    } else if (step === 13) {
      if (lowerCaseTranscript.includes("은행 비서")) {
        setNickName("");
        setSendMoney("")
        resetTranscript();
        setStep(step + 1)
      }
    } else if (step === 14) {
      // "다 지워" 하면 싹다 지워
      const moneyMatch = transcript.match(/\d+/g);
      if (moneyMatch) {
        setSendMoney(previousMoney + moneyMatch.join(""));
      }
      if (lowerCaseTranscript.includes("다 지워")) {
        setSendMoney("");
        setpreviousMoney("");
        resetTranscript();
      }
      if (lowerCaseTranscript.includes("하나 지워")) {
        setpreviousMoney(money.slice(0, -1));
        setSendMoney(money.slice(0, -1));
        resetTranscript();
      }

      if (
        lowerCaseTranscript.includes("응") ||
        lowerCaseTranscript.includes("다음")
      ) {
        if (!money) {
          setError("얼마 보낼지 알려주세요.");
        } else {
          setError(null);
          setStep(step + 1);
        }
        resetTranscript();
      }
      if (lowerCaseTranscript.includes("이전")) {
        setError(null);
        resetTranscript();
        if (favAccountId !== 0) {
          setFavAccountId(0);
          setFormalName("");
          setSendAccountNum("");
          setSendAccountNum("");
          setStep(step - 3);
        } else {
          setStep(step - 1);
        }
      }
    } else if (step === 15) {
      if (lowerCaseTranscript.includes("응")) {
        setStep(step + 1)
        resetTranscript();
      }
    } else if (step === 16) {
      if (lowerCaseTranscript.includes("다음")) {
        setStep(step + 1)
        resetTranscript();
      }
    }

    if (
      lowerCaseTranscript.includes("집") ||
      lowerCaseTranscript.includes("첫 화면") ||
      lowerCaseTranscript.includes("시작 화면") ||
      lowerCaseTranscript.includes("처음")
    ) {
      setStep(0);
      navigate("/");
      resetTranscript();
    }
    // } else {
    //   sendToNLP(transcript)
    //     .then((response) => {
    //       console.log("nlp로 보내고 돌아온 데이터입니다: ", response.text);
    //       handleVoiceCommands(response.text);
    //       // resetTranscript();
    //     })
    //     .catch((error) => {
    //       console.error("nlp 보내는데 문제생김: ", error);
    //       // resetTranscript();
    //     })
    //     .finally(() => {
    //       resetTranscript();
    //     });
    // }
  };

  return <div />;
};

export default SimTransferVoiceCommand;
