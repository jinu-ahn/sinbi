import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useNavigate, useLocation } from "react-router-dom";
import { useTransferStore } from "./TransferStore";
import {
  checkVirtualAccount,
  sendMoney,
  addFavorite,
} from "../../services/api";
import { sendToNLP } from "../../services/nlpApi";

// 목소리 오디오
import pickMyBankAccount from "../../assets/audio/22_어느_통장에서_돈을_보낼까요_하나를_골라_눌러주세요.mp3";
import sendToWho from "../../assets/audio/31_누구에게_보낼지_말하거나_눌러주세요_없으면_새로운_계좌라고_말하세요.mp3";
import sayAccountNum from "../../assets/audio/12_계좌번호를_말하거나_입력해주세요.mp3";
import sayBankType from "../../assets/audio/13_은행을_말하거나_찾아서_눌러주세요.mp3";
import continueOrNot from "../../assets/audio/59_계속하고_싶으면_'알았어'_뒤로_가고_싶으면_'이전'이라고_말해주세요.mp3";
import sendHowMuch from "../../assets/audio/25_얼마를_보낼지_말해주세요.mp3";
import sayYesOrNo from "../../assets/audio/08_좋으면_응_싫으면_아니_라고_말해주세요.mp3";
import sayNext from "../../assets/audio/06_다음으로_넘어가려면_다음이라고_말해주세요.mp3";
import whatNickname from "../../assets/audio/29_무슨_이름으로_기억할까요.mp3";

const TransferVoiceCommand: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 오디오말하기
  const playAudio = (audioFile: string) => {
    const audio = new Audio(audioFile);
    audio.play();
  };

  // Store에서 필요한거 전부 import!!
  const {
    step,
    setStep,
    nickName,
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
    formalName,
    setFormalName,
    favAccountId,
    setFavAccountId,
  } = useTransferStore();

  const { transcript, resetTranscript } = useSpeechRecognition();
  const [previousAccountNum, setPreviousAccountNum] = useState(sendAccountNum);
  const [previousMoney, setpreviousMoney] = useState(money);

  // 사용자가 뭐라하는지 계속 들어
  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true, language: "ko-KR" });
    // return () => {
    //   SpeechRecognition.stopListening();
    // };
  }, [location]);

  // 사용자가 뭐라 더 말할때마다 (transcript가 바뀔때마다)
  // handleVoiceCommand에 집어넣어 (전부 lowercase로 바꿔줌)
  useEffect(() => {
    handleVoiceCommands(transcript);
    console.log("Transcript: ", transcript);
  }, [transcript]);

  // transcript 전부 lowercase로 바꿔 (include로 키워드 찾을때 안걸리는 애들이 없도록 - 근데 사실 우린 한국어라 필요없긴해...)
  const handleVoiceCommands = (text: string) => {
    const lowerCaseTranscript = text.toLowerCase();

    // step 0 : 내 통장 목록 띄우기
    // step 1 : 즐겨찾는 계좌 목록 띄우기
    // step 2 : 받을 사람 계좌번호 입력
    // step 3 : 받을 사람 은행 입력 (여기서 그 사람이 존재하는지 체크 sendVirtualAccount)
    // step 4 : 얼마 보낼건지 입력
    // step 5 : 경고창 띄워주기
    // step 6 : 진짜 보낼거냐고 묻기 (응 / 예 들으면 여기서 이체)
    // step 7 : 보냈어요 페이지
    // step 8 : 다음에 또 보낼거냐고 묻기 (아니오 하면 메인페이지 응 하면 다음페이지)
    // step 9 : 즐겨찾기 계좌에 뭐라고 등록하는지 묻기 (이름 들으면 저장해서 즐겨찾는 계좌에 등록)

    if (step === 0) {
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
    } else if (step === 1) {
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
    } else if (step === 2) {
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
    } else if (step === 3) {
      if (
        lowerCaseTranscript.includes("아이비케이") ||
        lowerCaseTranscript.includes("기업")
      ) {
        setSendBankType("IBK");
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
          checkVirtualAccount(sendAccountNum, sendBankType)
            .then((response) => {
              console.log("계좌가 존재합니다: ", response);
              setFormalName(response.data.userName);
              setError(null);
              setStep(step + 1);
              resetTranscript();
            })
            .catch((error) => {
              setError("계좌가 없어요.");
              console.log("계좌 못 찾음: ", error);
            });
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
        playAudio(sayBankType);
        resetTranscript();
      }
    } else if (step === 4) {
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
    } else if (step === 5) {
      if (
        lowerCaseTranscript.includes("알겠어") ||
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
    } else if (step === 6) {
      if (
        lowerCaseTranscript.includes("보내") ||
        lowerCaseTranscript.includes("응") ||
        lowerCaseTranscript.includes("다음")
      ) {
        console.log("돈 보내는 로직");
        sendMoney(myAccountId, sendAccountNum, sendBankType, Number(money))
          .then((response) => {
            console.log("이체에 성공: ", response);
            resetTranscript();
            setStep(step + 1);
          })
          .catch((error) => {
            resetTranscript();
            console.error("계좌이체 못함: ", error);
          });
      }
      if (lowerCaseTranscript.includes("아니")) {
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
    } else if (step === 7) {
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
    } else if (step === 8) {
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
    } else if (step === 9) {
      if (lowerCaseTranscript.includes("다 지워")) {
        setNickName("");
        resetTranscript();
      } else {
        setNickName(transcript);
      }
      if (lowerCaseTranscript.includes("다음")) {
        // 즐겨찾기에 추가하는 로직
        addFavorite(formalName, sendAccountNum, sendBankType, nickName)
          .then((response) => {
            console.log("즐겨찾기에 성공적으로 추가: ", response);
            resetTranscript();
            setStep(step + 1);
          })
          .catch((error) => {
            console.error("즐겨찾기 추가 못함: ", error);
          });
      }
      if (
        lowerCaseTranscript.includes("신비") ||
        lowerCaseTranscript.includes("도와줘")
      ) {
        playAudio(whatNickname);
        resetTranscript();
      }
    } else if (step === 10) {
      if (lowerCaseTranscript.includes("응")) {
        setNickName("");
        resetTranscript();
        navigate("/main");
      }
    }

    if (
      lowerCaseTranscript.includes("집") ||
      lowerCaseTranscript.includes("첫 화면") ||
      lowerCaseTranscript.includes("시작 화면") ||
      lowerCaseTranscript.includes("처음")
    ) {
      setStep(0);
      navigate("/main");
      resetTranscript();
    } 
    else {
      sendToNLP(transcript)
        .then((response) => {
          if (response && response.text) {
            console.log("nlp로 보내고 돌아온 데이터입니다: ", response.text);
            handleVoiceCommands(response.text);
          } else {
            console.error("Received an unexpected response from NLP API: ", response);
          }
          resetTranscript();
        })
        .catch((error) => {
          console.error("nlp 보내는데 문제생김: ", error);
          resetTranscript();
        });
    }
  };

  return <div />;
};

export default TransferVoiceCommand;
