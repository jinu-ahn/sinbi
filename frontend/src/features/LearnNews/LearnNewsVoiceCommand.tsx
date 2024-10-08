import React, { useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useLearnNewsStore } from "./useLearnNewsStore";
import { useNavigate } from "react-router-dom";

const LearnNewsVoiceCommand: React.FC = () => {
  const navigate = useNavigate();
  // store에서 필요한거 전부 import!!
  const { transcript, resetTranscript } = useSpeechRecognition();
  const {
    setCurrentView,
    setCurrentLearnView,
    setSelectedCategory,
    currentView,
    currentLearnView,
    selectedCategory,
    setCurrentVideoIndex,
    currentVideoIndex,
  } = useLearnNewsStore();

  // 사용자가 뭐라하는지 계속 들어
  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true, language: "ko-KR" });
    // return () => {
    //   SpeechRecognition.stopListening();
    // };
  }, []);

  // 사용자가 뭐라 더 말할때마다 (transcript가 바뀔때마다)
  // handleVoiceCommand에 집어넣어 (전부 lowercase로 바꿔줌)
  useEffect(() => {
    handleVoiceCommands(transcript);
    console.log("Transcript: ", transcript);
  }, [transcript]);

  useEffect(() => {
    console.log("Current view: ", currentView);
    console.log("Current Learn View: ", currentLearnView);
    console.log("Current Category: ", selectedCategory);
  });

  // transcript 전부 lowercase로 바꿔 (include로 키워드 찾을때 안걸리는 애들이 없도록 - 근데 사실 우린 한국어라 필요없긴해...)
  const handleVoiceCommands = (transcript: string) => {
    const lowerCaseTranscript = transcript.toLowerCase();

    // ============================================================================================

    // 이건 배우기 들어와서 카테고리 세개 보여주는거임 (무조건 슬기로운 금융생활 말해)
    if (currentLearnView === "main") {
      // 슬기로운 금융생활 말했을때
      if (
        lowerCaseTranscript.includes("슬기로운") ||
        lowerCaseTranscript.includes("금융생활")
      ) {
        resetTranscript();
        setCurrentLearnView("category");
        setSelectedCategory("financial");
      }
      // 보이스피싱 예방 말했을때
      if (
        lowerCaseTranscript.includes("보이스피싱") ||
        lowerCaseTranscript.includes("예방")
      ) {
        resetTranscript();
        setCurrentLearnView("category");
        setSelectedCategory("voice");
      }

      // 금융 사기 예방 말했을때
      if (lowerCaseTranscript.includes("금융 사기")) {
        resetTranscript();
        setCurrentLearnView("category");
        setSelectedCategory("fraud");
      }

      if (
        lowerCaseTranscript.includes("뒤로") ||
        lowerCaseTranscript.includes("이전")
      ) {
        resetTranscript();
        setCurrentView("choice");
        setCurrentLearnView("");
      }
      // resetTranscript();
    }

    // ============================================================================================

    // 이건 카테고리 슬기로운 금융생활 골라서 영상제목 세개 보여주는거임

    if (selectedCategory === "financial") {
      if (lowerCaseTranscript.includes("고령자")) {
        setCurrentLearnView("video");
        setCurrentVideoIndex(0);
        resetTranscript();
      }
      if (lowerCaseTranscript.includes("활용법")) {
        setCurrentLearnView("video");
        setCurrentVideoIndex(1);
        resetTranscript();
      }
      if (lowerCaseTranscript.includes("간편")) {
        setCurrentLearnView("video");
        setCurrentVideoIndex(2);
        resetTranscript();
      }
      if (
        lowerCaseTranscript.includes("뒤로") ||
        lowerCaseTranscript.includes("이전")
      ) {
        setCurrentLearnView("main");
        setSelectedCategory(null);
        // setCurrentLearnView("main");
        resetTranscript();
      }
      if (lowerCaseTranscript.includes("다음")) {
        if (currentVideoIndex < 2) {
          setCurrentVideoIndex(currentVideoIndex + 1);
          resetTranscript();
        }
      }
    }

    // =====================================================================================
    // 이건 카테고리 보이스피싱 예방 골라서 영상제목 세개 보여주는거임

    if (selectedCategory === "voice") {
      if (
        lowerCaseTranscript.includes("보이스피싱") ||
        lowerCaseTranscript.includes("보이스 피싱")
      ) {
        setCurrentLearnView("video");
        setCurrentVideoIndex(0);
        resetTranscript();
      }
      if (lowerCaseTranscript.includes("대면편취형")) {
        setCurrentLearnView("video");
        setCurrentVideoIndex(1);
        resetTranscript();
      }
      if (lowerCaseTranscript.includes("기관사칭형")) {
        setCurrentLearnView("video");
        setCurrentVideoIndex(2);
        resetTranscript();
      }
      if (
        lowerCaseTranscript.includes("뒤로") ||
        lowerCaseTranscript.includes("이전")
      ) {
        resetTranscript();
        setSelectedCategory(null);
        setCurrentLearnView("main");
      }
      if (lowerCaseTranscript.includes("다음")) {
        if (currentVideoIndex < 2) {
          setCurrentVideoIndex(currentVideoIndex + 1);
          resetTranscript();
        }
      }
    }

    // =====================================================================================
    // 이건 카테고리 금융 사기 예방 골라서 영상제목 세개 보여주는거임

    if (selectedCategory === "fraud") {
      if (
        lowerCaseTranscript.includes("디지털 금융") ||
        lowerCaseTranscript.includes("디지털금융")
      ) {
        setCurrentLearnView("video");
        setCurrentVideoIndex(0);
        resetTranscript();
      }
      if (lowerCaseTranscript.includes("투자")) {
        setCurrentLearnView("video");
        setCurrentVideoIndex(1);
        resetTranscript();
      }
      if (lowerCaseTranscript.includes("판매")) {
        setCurrentLearnView("video");
        setCurrentVideoIndex(2);
        resetTranscript();
      }
      if (
        lowerCaseTranscript.includes("뒤로") ||
        lowerCaseTranscript.includes("이전")
      ) {
        resetTranscript();
        setSelectedCategory(null);
        setCurrentLearnView("main");
      }
      if (lowerCaseTranscript.includes("다음")) {
        if (currentVideoIndex < 2) {
          setCurrentVideoIndex(currentVideoIndex + 1);
          resetTranscript();
        }
      }
    }

    // =====================================================================================

    // 이건 금융 배우기 / 뉴스 고르는 거임
    if (currentView === "choice") {
      if (lowerCaseTranscript.includes("금융")) {
        setCurrentView("learn");
        setCurrentLearnView("main");
        resetTranscript();
      }

      if (lowerCaseTranscript.includes("뉴스")) {
        setCurrentView("news");
        setCurrentLearnView("");
        setSelectedCategory(null);
        resetTranscript();
      }
    }

    // ======================================================================================================

    if (currentView === "news") {
      if (
        lowerCaseTranscript.includes("이전") ||
        lowerCaseTranscript.includes("뒤로")
      ) {
        setCurrentView("choice");
        setCurrentLearnView("");
        setSelectedCategory(null);
        resetTranscript();
      }
    }

    // ==========================================================================

    if (
      lowerCaseTranscript.includes("집") ||
      lowerCaseTranscript.includes("시작 화면") ||
      lowerCaseTranscript.includes("처음")
    ) {
      setCurrentView("choice");
      setCurrentLearnView("");
      setSelectedCategory(null);
      navigate("/main");
      resetTranscript();
    }
  };

  return <div />;
};

export default LearnNewsVoiceCommand;
