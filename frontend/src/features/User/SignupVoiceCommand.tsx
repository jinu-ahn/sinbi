import React, { useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useNavigate, useLocation } from "react-router-dom";
import { useSignupStore } from "./SignupStore";

const SignupVoiceCommand: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { step, setStep } = useSignupStore(); // Access step and setStep from Zustand store
  const { transcript, resetTranscript } = useSpeechRecognition();

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
  }, [transcript]);

  // Function to handle voice commands and navigate to appropriate pages
  const handleVoiceCommands = (transcript: string) => {
    const lowerCaseTranscript = transcript.toLowerCase();

    if (
      lowerCaseTranscript.includes("응") ||
      lowerCaseTranscript.includes("다음")
    ) {
      setStep(step + 1); // Increment step using Zustand
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

export default SignupVoiceCommand;