import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import useUserStore from "./useUserStore";
import { SignUpStep } from "./User.types";
import { useNavigate } from "react-router-dom";
import {
  login,
  sendPhoneNumber,
  signup,
  verificationCodeCheck,
} from "../../services/api";
import { sendToNLP } from "../../services/nlpApi";
import sayNext from "../../assets/audio/06_다음으로_넘어가려면_다음이라고_말해주세요.mp3";
const VoiceCommand: React.FC = () => {
  const navigate = useNavigate();
  // const location = useLocation();

  const {
    currentStep,
    name,
    password,
    confirmPassword,
    faceImage,
    phone,
    smsCode,
    // error,
    setName,
    setPhone,
    setSmsCode,
    setPassword,
    setConfirmPassword,
    setFaceImage,
    nextStep,
    prevStep,
    setStep,
    setError,
    isAudioPlaying,
  } = useUserStore();

  const { transcript, resetTranscript } = useSpeechRecognition();
  // const [isListening, setIsListening] = useState(false);
  // const fileInputRef = useRef<HTMLInputElement>(null);

  const [, setPreviousName] = useState(name);
  const [previousPhone, setPreviousPhone] = useState(phone);
  const [previousSmsCode, setPreviousSmsCode] = useState(smsCode);
  const [, setPreviousPassword] = useState(password);
  const [previousConfirmPassword, setPreviousConfirmPassword] =
    useState(confirmPassword);

  const playAudio = (audioFile: string) => {
    const audio = new Audio(audioFile);
    audio.play();
  };

  // 한국어를 듣게 지정 + 바뀌는 위치 (페이지)에 따라 들었다 멈췄다 함
  useEffect(() => {
    if (isAudioPlaying) {
      SpeechRecognition.stopListening(); // Stop listening if audio is playing
      // SpeechRecognition.abortListening();
    } else if (isAudioPlaying === false) {
      SpeechRecognition.startListening({ continuous: true, language: "ko-KR" }); // Start listening when audio is not playing
    }

    // return () => {
    //   SpeechRecognition.stopListening(); // Ensure to stop listening when component unmounts or re-renders
    // };
  }, [isAudioPlaying]); // Dependency on isAudioPlaying to dynamically control listening

  useEffect(() => {
    if (!isAudioPlaying) {
      handleVoiceCommands(transcript); // Handle voice commands only when audio is not playing
    }
  }, []);

  useEffect(() => {
    handleVoiceCommands(transcript);
    console.log("사용자가 하는 말: ", transcript);
  }, [transcript]);

  const handleVoiceCommands = (text: string) => {
    const lowerCaseTranscript = text.toLowerCase();

    if (lowerCaseTranscript.includes("다 지워")) {
      resetCurrentField();
      resetTranscript();
      return;
    }

    if (lowerCaseTranscript.includes("하나 지워")) {
      removeLastCharacter();
      resetTranscript();
      return;
    }

    if (
      lowerCaseTranscript.includes("다음") ||
      lowerCaseTranscript.includes("넘어가")
    ) {
      // setIsAudioPlaying(true)
      handleNext();
      resetTranscript();
      return;
    }

    if (
      lowerCaseTranscript.includes("뒤로가") ||
      lowerCaseTranscript.includes("이전")
    ) {
      prevStep();
      resetTranscript();
      return;
    }

    if (
      lowerCaseTranscript.includes("신비야") ||
      lowerCaseTranscript.includes("도와줘")
    ) {
      playAudio(sayNext);
      resetTranscript();
      return;
    }

    switch (currentStep) {
      case SignUpStep.Welcome:
        if (lowerCaseTranscript.includes("시작")) {
          nextStep();
          // resetTranscript();
        }
        // resetTranscript();
        break;
      case SignUpStep.UserName:
        if (lowerCaseTranscript.includes("어쩌구")) {
          console.log("어쩌구라고 함");
        } else {
          console.log("transcript: ", transcript);
          handleNameInput(transcript);
        }
        // resetTranscript();
        break;
      case SignUpStep.UserPhone:
        handlePhoneInput(text);
        // resetTranscript();
        break;
      case SignUpStep.SmsVerification:
        handleSmsCodeInput(text);
        // resetTranscript();
        break;
      case SignUpStep.UserPassword:
        // handlePasswordInput(text);
        // resetTranscript();
        break;
      case SignUpStep.ConfirmPassword:
        // handleConfirmPasswordInput(text);
        if (
          lowerCaseTranscript.includes("다음") ||
          lowerCaseTranscript.includes("넘어가")
        ) {
          handlePasswordConfirmation();
        } else {
          handleConfirmPasswordInput(text);
        }
        // resetTranscript();
        break;
      case SignUpStep.StartFaceRecognition:
        if (lowerCaseTranscript.includes("시작")) {
          nextStep();
        } else if (lowerCaseTranscript.includes("아니")) {
          handleSignUp();
          setStep(SignUpStep.SignUpComplete);
        }
        // resetTranscript();
        break;
      case SignUpStep.FaceRecognitionInProgress:
        if (
          lowerCaseTranscript.includes("사진") ||
          lowerCaseTranscript.includes("찍어") ||
          lowerCaseTranscript.includes("해") ||
          lowerCaseTranscript.includes("시작")
        ) {
          // 여기서 카메라를 열고 사진을 찍는 로직을 추가해야 합니다.
          openCamera();
          console.log("사진 찍기 시도");
        }
        // resetTranscript();
        break;
      case SignUpStep.FaceRecognitionComplete:
        if (lowerCaseTranscript.includes("완료")) {
          handleSignUp();
        } else if (
          lowerCaseTranscript.includes("다음") ||
          lowerCaseTranscript.includes("넘어가") ||
          lowerCaseTranscript.includes("취소")
        ) {
          nextStep();
        }
        // resetTranscript();
        break;
      case SignUpStep.Login:
        if (lowerCaseTranscript.includes("로그인")) {
          handleLogin();
        }
        // resetTranscript();
        break;
    }

    if (
      lowerCaseTranscript.includes("집") ||
      lowerCaseTranscript.includes("시작 화면") ||
      lowerCaseTranscript.includes("처음")
    ) {
      resetAllFields();
      setStep(SignUpStep.Welcome);
      navigate("/");
      resetTranscript();
    } else {
      sendToNLP(transcript)
        .then((response) => {
          if (response && response.text) {
            console.log("nlp로 보내고 돌아온 데이터입니다: ", response.text);
            handleVoiceCommands(response.text);
          } else {
            console.error(
              "Received an unexpected response from NLP API: ",
              response,
            );
          }
          // resetTranscript();
        })
        .catch((error) => {
          console.error("nlp 보내는데 문제생김: ", error);
          // resetTranscript();
        });
    }
  };

  const resetCurrentField = () => {
    switch (currentStep) {
      case SignUpStep.UserName:
        setName("");
        setPreviousName("");
        break;
      case SignUpStep.UserPhone:
        setPhone("");
        setPreviousPhone("");
        resetTranscript();
        break;
      case SignUpStep.SmsVerification:
        setSmsCode("");
        setPreviousSmsCode("");
        break;
      case SignUpStep.UserPassword:
        setPassword("");
        setPreviousPassword("");
        break;
      case SignUpStep.ConfirmPassword:
        setConfirmPassword("");
        setPreviousConfirmPassword("");
        break;
    }
  };

  const removeLastCharacter = () => {
    switch (currentStep) {
      // case SignUpStep.UserName:
      //   setName(name.slice(0, -1));
      //   setPreviousName(name.slice(0, -1));
      //   break;
      case SignUpStep.UserPhone:
        setPhone(phone.slice(0, -1));
        setPreviousPhone(phone.slice(0, -1));
        resetTranscript();
        break;
      // setPhone(phone.slice(0, -1));
      // setPreviousPhone(phone.slice(0, -1));
      // break;
      case SignUpStep.SmsVerification:
        setSmsCode(smsCode.slice(0, -1));
        setPreviousSmsCode(smsCode.slice(0, -1));
        break;
      case SignUpStep.UserPassword:
        setPassword(password.slice(0, -1));
        setPreviousPassword(password.slice(0, -1));
        break;
      case SignUpStep.ConfirmPassword:
        setConfirmPassword(confirmPassword.slice(0, -1));
        setPreviousConfirmPassword(confirmPassword.slice(0, -1));
        break;
    }
  };

  const handleNext = async () => {
    switch (currentStep) {
      case SignUpStep.UserPhone:
        await handleSendSms();
        break;
      case SignUpStep.SmsVerification:
        await handleVerifySms();
        break;
      case SignUpStep.ConfirmPassword:
        handlePasswordConfirmation();
        break;
      default:
        nextStep();
    }
  };

  const handleNameInput = (text: string) => {
    // const newName = previousName + text.trim();
    setName(text);
    setPreviousName(text);
  };

  const handlePhoneInput = (text: string) => {
    const phoneNum = text.match(/\d+/g);
    if (phoneNum) {
      const newPhone = previousPhone + phoneNum.join("");
      setPhone(newPhone);
    }

    // const phoneNumber = transcript.match(/\d+/g);
    //   if (phoneNumber) {
    //     setPhone(previousPhoneNum + phoneNumberMatch.join(""));
    //   }
    // const lowerCaseText = text.toLowerCase();

    // // 숫자 입력 처리
    // const phoneNumberMatch = text.match(/\d+/g);
    // if (phoneNumberMatch) {
    //   // const newPhone = previousPhone + phoneNumberMatch.join("");
    //   // console.log("new phone: ", newPhone);
    //   setPhone(previousPhone + phoneNumberMatch.join(""));
    //   // setPreviousPhone(newPhone);
    // }

    // // "다 지워" 명령어 처리
    // if (lowerCaseText.includes("다 지워")) {
    //   setPhone("");
    //   setPreviousPhone("");
    //   resetTranscript();
    // }

    // // "하나 지워" 명령어 처리
    // if (lowerCaseText.includes("하나 지워")) {
    //   const newPhone = phone.slice(0, -1);
    //   setPhone(newPhone);
    //   setPreviousPhone(newPhone);
    //   resetTranscript();
    // }
  };

  const handleSmsCodeInput = (text: string) => {
    const smsCodeMatch = text.match(/\d+/g);
    if (smsCodeMatch) {
      const newSmsCode = previousSmsCode + smsCodeMatch.join("");
      setSmsCode(newSmsCode);
      // setPreviousSmsCode(newSmsCode);
    }
  };
  const openCamera = () => {
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  // const handlePasswordInput = (text: string) => {
  //   const passwordMatch = text.match(/\d+/g);
  //   if (passwordMatch) {
  //     const newPassword = previousPassword + passwordMatch.join("");
  //     setPassword(newPassword);
  //     setPreviousPassword(newPassword);
  //   }
  // };

  const handleConfirmPasswordInput = (text: string) => {
    const confirmPasswordMatch = text.match(/\d+/g);
    if (confirmPasswordMatch) {
      const newConfirmPassword =
        previousConfirmPassword + confirmPasswordMatch.join("");
      setConfirmPassword(newConfirmPassword);
      // setPreviousConfirmPassword(newConfirmPassword);
    }
  };

  const handleSendSms = async () => {
    try {
      await sendPhoneNumber(phone);
      setError(null);
      nextStep();
    } catch (error) {
      if (error instanceof Error) {
        setError(`sms 전송 중 오류가 발생했습니다: ${error.message}`);
      } else {
        setError("sms 전송 중 알 수 없는 오류가 발생했습니다.");
      }
      return false;
    }
  };

  const handleVerifySms = async () => {
    try {
      const response = await verificationCodeCheck(phone, smsCode);
      if (response.status === "인증이 되었습니다.") {
        setError(null);
        nextStep();
      } else {
        setError("인증 코드가 일치하지 않습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(`SMS 인증 중 오류가 발생했습니다: ${error.message}`);
      } else {
        setError("SMS 인증 중 알 수 없는 오류가 발생했습니다.");
      }
      return false;
    }
  };

  const handlePasswordConfirmation = () => {
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
      setStep(SignUpStep.UserPassword);
      setPassword("");
      setConfirmPassword("");
      setPreviousPassword("");
      setPreviousConfirmPassword("");
    } else {
      nextStep();
    }
  };

  const handleSignUp = async () => {
    try {
      const signUpData = {
        userName: name,
        userPhone: phone,
        userPassword: password,
      };
      await signup(signUpData, faceImage);
      setStep(SignUpStep.SignUpComplete);
    } catch (error) {
      if (error instanceof Error) {
        setError(`회원가입에 실패했습니다: ${error.message}`);
      } else {
        setError("회원가입 중 알 수 없는 오류가 발생했습니다.");
      }
      return false;
    }
  };

  const handleLogin = async () => {
    try {
      const loginDto = {
        phone,
        password: faceImage ? undefined : password,
      };
      const response = await login(loginDto, faceImage);
      if (response.status === "SUCCESS") {
        navigate("/main");
      } else {
        setError("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(`로그인에 실패했습니다: ${error.message}`);
      } else {
        setError("로그인 중 알 수 없는 오류가 발생했습니다.");
      }
      return false;
    }
  };

  const resetAllFields = () => {
    setName("");
    setPhone("");
    setSmsCode("");
    setPassword("");
    setConfirmPassword("");
    setFaceImage(undefined);
    setPreviousName("");
    setPreviousPhone("");
    setPreviousSmsCode("");
    setPreviousPassword("");
    setPreviousConfirmPassword("");
    setError(null);
  };

  return <div />;
};

export default VoiceCommand;
