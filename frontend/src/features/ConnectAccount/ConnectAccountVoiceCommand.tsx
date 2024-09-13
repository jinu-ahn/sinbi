import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useNavigate, useLocation } from "react-router-dom";
import { useConnectAccountStore } from "./ConnectAccountStore";

const ConnectAccountVoiceCommand: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { step, setStep, accountNum, setAccountNum, setBankType } =
    useConnectAccountStore();
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [currentAccountNum, setCurrentAccountNum] = useState(accountNum);

  // Start continuous listening when the component mounts
  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true, language: "ko-KR" });
    return () => {
      SpeechRecognition.stopListening();
    };
  }, [location]);

  // Trigger handleVoiceCommands every time the transcript changes
  useEffect(() => {
    handleVoiceCommands(transcript);
    console.log(transcript)
  }, [transcript]);

  // Function to handle voice commands and navigate to appropriate pages
  const handleVoiceCommands = (transcript: string) => {
    const lowerCaseTranscript = transcript.toLowerCase();

    if (step === 0) {
      // If the user says "다 지워" or "전부 지워", clear the entire account number
      if (
        lowerCaseTranscript.includes("다 지워") ||
        lowerCaseTranscript.includes("전부 지워")
      ) {
        setAccountNum(""); // Clear the account number
        setCurrentAccountNum("");
        resetTranscript();
      }
      // If the user says "지워", remove the last digit
      else if (
        lowerCaseTranscript.includes("지워") ||
        lowerCaseTranscript.includes("하나")
      ) {
        const updatedAccountNum = currentAccountNum.slice(0, -1); // Remove last character
        setCurrentAccountNum(updatedAccountNum); // Update local state
        setAccountNum(updatedAccountNum); // Update Zustand store
        resetTranscript();
      }
      // If the user says a number, add it to the account number
      else {
        const accountNumberMatch = transcript.match(/\d+/g); // Find numbers in the transcript
        if (accountNumberMatch) {
          const newAccountNum = accountNumberMatch.join(""); // Append new numbers
          setCurrentAccountNum((prev) => prev + newAccountNum); // Update local state
          setAccountNum(currentAccountNum); // Update Zustand store
          resetTranscript(); // Reset transcript after updating the account number
        }
      }
    } else if (step === 1) {
      // Step 1: Bank type input
      if (
        lowerCaseTranscript.includes("아이비케이") ||
        lowerCaseTranscript.includes("기업")
      ) {
        setBankType("ibk");
      } else if (
        lowerCaseTranscript.includes("케이비") ||
        lowerCaseTranscript.includes("국민")
      ) {
        setBankType("kookmin");
      } else if (
        lowerCaseTranscript.includes("케이디비") ||
        lowerCaseTranscript.includes("산업")
      ) {
        setBankType("kdb");
      } else if (
        lowerCaseTranscript.includes("케이이비") ||
        lowerCaseTranscript.includes("외환")
      ) {
        setBankType("keb");
      } else if (
        lowerCaseTranscript.includes("엔에이치") ||
        lowerCaseTranscript.includes("농협")
      ) {
        setBankType("nh");
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
        setBankType("kyungnam");
      } else if (lowerCaseTranscript.includes("광주")) {
        setBankType("gwanju");
      } else if (lowerCaseTranscript.includes("대구")) {
        setBankType("daegu");
      } else if (lowerCaseTranscript.includes("부산")) {
        setBankType("busan");
      } else if (lowerCaseTranscript.includes("산림조합")) {
        setBankType("sanlim");
      } else if (lowerCaseTranscript.includes("새마을")) {
        setBankType("saemaeul");
      } else if (lowerCaseTranscript.includes("수협")) {
        setBankType("suhyub");
      } else if (lowerCaseTranscript.includes("신한")) {
        setBankType("shinhan");
      } else if (lowerCaseTranscript.includes("신협")) {
        setBankType("shinhyub");
      } else if (lowerCaseTranscript.includes("씨티")) {
        setBankType("city");
      } else if (lowerCaseTranscript.includes("우리")) {
        setBankType("woori");
      } else if (lowerCaseTranscript.includes("우체국")) {
        setBankType("post");
      } else if (lowerCaseTranscript.includes("저축")) {
        setBankType("jyochuk");
      } else if (lowerCaseTranscript.includes("전북")) {
        setBankType("jyunbuk");
      } else if (lowerCaseTranscript.includes("제주")) {
        setBankType("jeju");
      } else if (lowerCaseTranscript.includes("카카오")) {
        setBankType("kakao");
      } else if (lowerCaseTranscript.includes("토스")) {
        setBankType("toss");
      } else if (lowerCaseTranscript.includes("하나")) {
        setBankType("hana");
      } else if (lowerCaseTranscript.includes("한국투자증권")) {
        setBankType("hankuktuza");
      }
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
    } else if (
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