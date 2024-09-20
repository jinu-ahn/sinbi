import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useNavigate, useLocation } from "react-router-dom";
import { useConnectAccountStore } from "./ConnectAccountStore";
import {
  checkVirtualAccount,
  sendPhoneNumber,
  verificationCodeCheck,
} from "../../services/api";

const ConnectAccountVoiceCommand: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // AccountStore에서 필요한거 전부 import!!
  const {
    step,
    setStep,
    accountNum,
    bankType,
    setAccountNum,
    setBankType,
    setPhoneNum,
    phoneNum,
    verificationCode,
    setVerificationCode,
  } = useConnectAccountStore();

  const { transcript, resetTranscript } = useSpeechRecognition();
  const [previousAccountNum, setPreviousAccountNum] = useState(accountNum);
  const [previousPhoneNum, setPreviousPhoneNum] = useState(phoneNum);
  const [PreviousVerificationCode, setPreviousVerificationCode] =
    useState(phoneNum);

  // 사용자가 뭐라하는지 계속 들어
  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true, language: "ko-KR" });
    return () => {
      SpeechRecognition.stopListening();
    };
  }, [location]);

  // 사용자가 뭐라 더 말할때마다 (transcript가 바뀔때마다)
  // handleVoiceCommand에 집어넣어 (전부 lowercase로 바꿔줌)
  useEffect(() => {
    handleVoiceCommands(transcript);
    console.log("Transcript: ", transcript);
  }, [transcript]);

  // transcript 전부 lowercase로 바꿔 (include로 키워드 찾을때 안걸리는 애들이 없도록 - 근데 사실 우린 한국어라 필요없긴해...)
  const handleVoiceCommands = (transcript: string) => {
    const lowerCaseTranscript = transcript.toLowerCase();

    // step 0 : 계좌번호 받기
    // step 1 : 은행 종류 받기
    // step 2 : 제대로 받았는지 체크
    // step 3 : 전화번호 받기
    // step 4 : 인증번호 받기
    if (step === 0) {
      // "다 지워" 하면 accountNum 싹다 지워
      const accountNumberMatch = transcript.match(/\d+/g);
      if (accountNumberMatch) {
        setAccountNum(previousAccountNum + accountNumberMatch.join(""));
      }
      if (lowerCaseTranscript.includes("다 지워")) {
        setAccountNum("");
        setPreviousAccountNum("");
        resetTranscript();
      }
      if (lowerCaseTranscript.includes("하나 지워")) {
        setPreviousAccountNum(accountNum.slice(0, -1));
        setAccountNum(accountNum.slice(0, -1));
        resetTranscript();
      }

      if (
        lowerCaseTranscript.includes("응") ||
        lowerCaseTranscript.includes("다음")
      ) {
        setStep(step + 1);
        resetTranscript();
      } else if (
        lowerCaseTranscript.includes("뒤로가") ||
        lowerCaseTranscript.includes("이전")
      ) {
        setStep(step - 1);
        resetTranscript();
      }
    } else if (step === 1) {
      if (
        lowerCaseTranscript.includes("아이비케이") ||
        lowerCaseTranscript.includes("기업")
      ) {
        setBankType("IBK");
      } else if (
        lowerCaseTranscript.includes("케이비") ||
        lowerCaseTranscript.includes("국민")
      ) {
        setBankType("KOOKMIN");
      } else if (
        lowerCaseTranscript.includes("케이디비") ||
        lowerCaseTranscript.includes("산업")
      ) {
        setBankType("KDB");
      } else if (
        lowerCaseTranscript.includes("케이이비") ||
        lowerCaseTranscript.includes("외환")
      ) {
        setBankType("KEB");
      } else if (
        lowerCaseTranscript.includes("엔에이치") ||
        lowerCaseTranscript.includes("농협")
      ) {
        setBankType("NH");
      } else if (
        lowerCaseTranscript.includes("에스비아이") ||
        lowerCaseTranscript.includes("에스비아이저축")
      ) {
        setBankType("SBI");
      } else if (
        lowerCaseTranscript.includes("에스씨") ||
        lowerCaseTranscript.includes("제일")
      ) {
        setBankType("SC");
      } else if (lowerCaseTranscript.includes("경남")) {
        setBankType("KYUNGNAM");
      } else if (lowerCaseTranscript.includes("광주")) {
        setBankType("GWANJU");
      } else if (lowerCaseTranscript.includes("대구")) {
        setBankType("DAEGU");
      } else if (lowerCaseTranscript.includes("부산")) {
        setBankType("BUSAN");
      } else if (lowerCaseTranscript.includes("산림조합")) {
        setBankType("SANLIM");
      } else if (lowerCaseTranscript.includes("새마을")) {
        setBankType("SAEMAEUL");
      } else if (lowerCaseTranscript.includes("수협")) {
        setBankType("SUHYUB");
      } else if (lowerCaseTranscript.includes("신한")) {
        setBankType("SHINHAN");
      } else if (lowerCaseTranscript.includes("신협")) {
        setBankType("SHINHYUB");
      } else if (lowerCaseTranscript.includes("씨티")) {
        setBankType("CITY");
      } else if (lowerCaseTranscript.includes("우리")) {
        setBankType("WOORI");
      } else if (lowerCaseTranscript.includes("우체국")) {
        setBankType("POSTBANK");
      } else if (lowerCaseTranscript.includes("저축")) {
        setBankType("JYOCHUK");
      } else if (lowerCaseTranscript.includes("전북")) {
        setBankType("JYUNBUK");
      } else if (lowerCaseTranscript.includes("제주")) {
        setBankType("JEJU");
      } else if (lowerCaseTranscript.includes("카카오")) {
        setBankType("KAKAO");
      } else if (lowerCaseTranscript.includes("토스")) {
        setBankType("TOSS");
      } else if (lowerCaseTranscript.includes("하나")) {
        setBankType("HANA");
      } else if (lowerCaseTranscript.includes("한국투자증권")) {
        setBankType("HANKUKTUZA");
      }

      if (
        lowerCaseTranscript.includes("응") ||
        lowerCaseTranscript.includes("다음")
      ) {
        setStep(step + 1);
        resetTranscript();
      } else if (
        lowerCaseTranscript.includes("뒤로가") ||
        lowerCaseTranscript.includes("이전")
      ) {
        setStep(step - 1);
        resetTranscript();
      }
    } else if (step === 2) {
      if (lowerCaseTranscript.includes("맞아")) {
        // need to send axios request to BASEURL/virtualAccount/check
        checkVirtualAccount(accountNum, bankType)
          .then((data) => {
            console.log("계좌 확인 성공적: ", data);
            setStep(step + 1);
          })
          .catch((error) => {
            console.error("해당 계좌 없음: ", error);
          });
        resetTranscript();
      }

      if (
        lowerCaseTranscript.includes("뒤로가") ||
        lowerCaseTranscript.includes("이전")
      ) {
        setStep(step - 1);
        resetTranscript();
      }
    } else if (step === 3) {
      // 이외에는 사용자가 숫자를 말할테니까 숫자면 이미 존재하는거에 추가해
      const phoneNumberMatch = transcript.match(/\d+/g);
      if (phoneNumberMatch) {
        setPhoneNum(previousPhoneNum + phoneNumberMatch.join(""));
      }
      if (lowerCaseTranscript.includes("다 지워")) {
        setPhoneNum("");
        setPreviousPhoneNum("");
        resetTranscript();
      }
      // "지워" 아니면 "하나 뒤로 가" 하면 한글자만 지워
      if (lowerCaseTranscript.includes("하나 지워")) {
        setPreviousPhoneNum(phoneNum.slice(0, -1));
        setPhoneNum(phoneNum.slice(0, -1));
        resetTranscript();
      }

      if (
        lowerCaseTranscript.includes("맞아") ||
        lowerCaseTranscript.includes("확인") ||
        lowerCaseTranscript.includes("다음")
      ) {
        // need to send axios request to BASEURL/virtualAccount/check
        sendPhoneNumber(phoneNum)
          .then((data) => {
            console.log("전화번호 성공적: ", data);
            setStep(step + 1);
          })
          .catch((error) => {
            console.error("전화번호 없음: ", error);
          });
        resetTranscript();
      }

      if (
        lowerCaseTranscript.includes("뒤로가") ||
        lowerCaseTranscript.includes("이전")
      ) {
        setStep(step - 1);
        resetTranscript();
      }
    } else if (step === 4) {
      // 이외에는 사용자가 숫자를 말할테니까 숫자면 이미 존재하는거에 추가해

      const CodeMatch = transcript.match(/\d+/g); // Find numbers in the transcript
      if (CodeMatch) {
        setVerificationCode(PreviousVerificationCode + CodeMatch.join(""));
      }
      if (lowerCaseTranscript.includes("다 지워")) {
        setVerificationCode("");
        setPreviousVerificationCode("");
        resetTranscript();
      }
      // "하나 지워" 하면 한글자만 지워
      if (lowerCaseTranscript.includes("하나 지워")) {
        setPreviousVerificationCode(verificationCode.slice(0, -1));
        setVerificationCode(verificationCode.slice(0, -1));
        resetTranscript();
      }

      if (
        lowerCaseTranscript.includes("확인") ||
        lowerCaseTranscript.includes("끝")
      ) {
        verificationCodeCheck(phoneNum, verificationCode)
          .then((data) => {
            console.log("인증번호 성공적: ", data);
            setStep(step + 1);
          })
          .catch((error) => {
            console.error("인증번호 오류: ", error);
          });
        resetTranscript();
      }

      if (
        lowerCaseTranscript.includes("뒤로가") ||
        lowerCaseTranscript.includes("이전")
      ) {
        setStep(step - 1);
        resetTranscript();
      }
    }

    if (
      lowerCaseTranscript.includes("집") ||
      lowerCaseTranscript.includes("시작 화면") ||
      lowerCaseTranscript.includes("처음")
    ) {
      navigate("/");
      resetTranscript();
    }
  };

  return <div />;
};

export default ConnectAccountVoiceCommand;