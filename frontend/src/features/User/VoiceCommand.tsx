import React, { useEffect, useState, useRef } from "react";
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

const VoiceCommand: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    name,
    phone,
    smsCode,
    password,
    confirmPassword,
    faceImage,
    setName,
    setPhone,
    setSmsCode,
    setPassword,
    setConfirmPassword,
    setFaceImage,
    nextStep,
    prevStep,
    setStep,
  } = useUserStore();

  const [error, setError] = useState<string | null>(null);
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 한국어를 듣게 지정 + 바뀌는 위치 (페이지)따라 들었다 멈췄다 함
  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true, language: "ko-KR" });
    return () => {
      SpeechRecognition.stopListening();
    };
  }, []);


  useEffect(() => {
    handleVoiceCommand(transcript);
  }, [transcript]);

  const handleUserName = (command: string) => {
    setName(command.trim());
  };

  const handleUserPhone = (command: string) => {
    const phoneNumber = command.replace(/[^0-9]/g, "");
    setPhone(phoneNumber);
  };

  const handleSmsVerification = (command: string) => {
    const smsCodeNumber = command.replace(/[^0-9]/g, "");
    setSmsCode(smsCodeNumber);
  };

  const handlePassword = (command: string, isConfirmation: boolean) => {
    const passwordNumber = command.replace(/[^0-9]/g, "");
    if (isConfirmation) {
      setConfirmPassword(passwordNumber);
    } else {
      setPassword(passwordNumber);
    }
  };

  const handleVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();

    // 공통 명령어
    if (lowerCommand.includes("다음") || lowerCommand.includes("넘어가")) {
      await handleNext();
      resetTranscript();
      return;
    }
    if (lowerCommand.includes("이전") || lowerCommand.includes("뒤로")) {
      prevStep();
      resetTranscript();
      return;
    }
    if (
      lowerCommand.includes("집") ||
      lowerCommand.includes("시작 화면") ||
      lowerCommand.includes("처음")
    ) {
      handleResetAndNavigateHome();
      return;
    }

    // 단계별 명령어 처리
    switch (currentStep) {
      case SignUpStep.Welcome:
        handleWelcomeStep(lowerCommand);
        break;
      case SignUpStep.UserName:
        handleUserName(command);
        break;
      case SignUpStep.UserPhone:
        handleUserPhone(command);
        break;
      case SignUpStep.SmsVerification:
        handleSmsVerification(command);
        break;
      case SignUpStep.UserPassword:
        handlePassword(command, false);
        break;
      case SignUpStep.ConfirmPassword:
        handlePassword(command, true);
        break;
      case SignUpStep.StartFaceRecognition:
        handleStartFaceRecognition(lowerCommand);
        break;
      case SignUpStep.FaceRecognitionInProgress:
        handleFaceRecognitionInProgress(lowerCommand);
        break;
      case SignUpStep.FaceRecognitionComplete:
        handleFaceRecognitionComplete(lowerCommand);
        break;
      case SignUpStep.Login:
        handleLoginStep(lowerCommand);
        break;
      default:
        handleDefaultCase(command);
    }

    resetTranscript();
  };

  const handleResetAndNavigateHome = () => {
    setName("");
    setPhone("");
    setSmsCode("");
    setPassword("");
    setConfirmPassword("");
    setFaceImage(undefined);
    setStep(SignUpStep.Welcome);
    navigate("/sim");
    resetTranscript();
  };

  const handleWelcomeStep = (lowerCommand: string) => {
    if (lowerCommand.includes("시작")) {
      nextStep();
    }
  };

  const handleStartFaceRecognition = (lowerCommand: string) => {
    if (lowerCommand.includes("시작")) {
      nextStep();
    }
  };

  const handleFaceRecognitionInProgress = (lowerCommand: string) => {
    if (lowerCommand.includes("사진") || lowerCommand.includes("찍어")) {
      openCamera();
    }
  };

  const handleFaceRecognitionComplete = async (lowerCommand: string) => {
    if (lowerCommand.includes("완료")) {
      await handleSignUp();
    }
  };

  const handleLoginStep = async (lowerCommand: string) => {
    if (lowerCommand.includes("로그인")) {
      await handleLogin();
    }
  };

  const handleDefaultCase = async (command: string) => {
    try {
      const response = await sendToNLP(command);
      if (response && response.text) {
        console.log("nlp로 보내고 돌아온 데이터입니다: ", response.text);
        await handleVoiceCommand(response.text);
      } else {
        console.error(
          "Received an unexpected response from NLP API: ",
          response,
        );
      }
    } catch (error) {
      console.error("nlp 보내는데 문제생김: ", error);
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

  const handleSendSms = async () => {
    try {
      await sendPhoneNumber(phone);
      setError(null);
      nextStep();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(`SMS 전송에 실패했습니다: ${error.message}`);
      } else {
        setError("SMS 전송에 실패했습니다. 다시 시도해주세요.");
      }
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(`SMS 인증에 실패했습니다: ${error.message}`);
      } else {
        setError("SMS 인증에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handlePasswordConfirmation = () => {
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
      setStep(SignUpStep.UserPassword);
      setPassword("");
      setConfirmPassword("");
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
      nextStep();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(`SMS 전송에 실패했습니다: ${error.message}`);
      } else {
        setError("SMS 전송에 실패했습니다. 다시 시도해주세요.");
      }
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(`로그인에 실패했습니다: ${error.message}`);
      } else {
        setError("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const openCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFaceImage(file);
      nextStep();
    }
  };

  return (
    <div>
      <button onClick={() => setIsListening(!isListening)}>
        {isListening ? "음성 인식 중지" : "음성 인식 시작"}
      </button>
      {error && <p>{error}</p>}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        ref={fileInputRef}
        capture="user"
      />
    </div>
  );
};

export default VoiceCommand;

// import React, { useEffect, useState, useRef } from "react";
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";
// import useUserStore from "./useUserStore";
// import { SignUpStep } from "./User.types";
// import { useNavigate } from "react-router-dom";
// import {
//   login,
//   sendPhoneNumber,
//   signup,
//   verificationCodeCheck,
// } from "../../services/api";
// import { sendToNLP } from "../../services/nlpApi";

// const VoiceCommand: React.FC = () => {
//   const navigate = useNavigate();
//   const {
//     currentStep,
//     name,
//     phone,
//     smsCode,
//     password,
//     confirmPassword,
//     faceImage,
//     setName,
//     setPhone,
//     setSmsCode,
//     setPassword,
//     setConfirmPassword,
//     setFaceImage,
//     nextStep,
//     prevStep,
//     setStep,
//   } = useUserStore();

//   const [error, setError] = useState<string | null>(null);
//   const { transcript, resetTranscript } = useSpeechRecognition();
//   const [isListening, setIsListening] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (isListening) {
//       SpeechRecognition.startListening({ continuous: true, language: "ko-KR" });
//     } else {
//       SpeechRecognition.stopListening();
//     }
//     return () => {
//       SpeechRecognition.stopListening();
//     };
//   }, [isListening]);

//   useEffect(() => {
//     handleVoiceCommand(transcript);
//   }, [transcript]);

//   const handleVoiceCommand = async (command: string) => {
//     const lowerCommand = command.toLowerCase();

//     // 공통 명령어
//     if (lowerCommand.includes("다음") || lowerCommand.includes("넘어가")) {
//       await handleNext();
//       resetTranscript();
//       return;
//     }
//     if (lowerCommand.includes("이전") || lowerCommand.includes("뒤로")) {
//       prevStep();
//       resetTranscript();
//       return;
//     }
//     if (
//       lowerCommand.includes("집") ||
//       lowerCommand.includes("시작 화면") ||
//       lowerCommand.includes("처음")
//     ) {
//       // 모든 상태 초기화
//       setName("");
//       setPhone("");
//       setSmsCode("");
//       setPassword("");
//       setConfirmPassword("");
//       setFaceImage(undefined);
//       setStep(SignUpStep.Welcome);
//       navigate("/sim");
//       resetTranscript();
//       return;
//     }

//     // 단계별 명령어 처리
//     switch (currentStep) {
//       case SignUpStep.Welcome:
//         if (lowerCommand.includes("시작")) {
//           nextStep();
//         }
//         break;
//       case SignUpStep.UserName:
//         setName(command.trim());
//         break;
//       case SignUpStep.UserPhone:
//         const phoneNumber = command.replace(/[^0-9]/g, "");
//         setPhone(phoneNumber);
//         break;
//       case SignUpStep.SmsVerification:
//         const smsCodeNumber = command.replace(/[^0-9]/g, "");
//         setSmsCode(smsCodeNumber);
//         break;
//       case SignUpStep.UserPassword:
//       case SignUpStep.ConfirmPassword:
//         const passwordNumber = command.replace(/[^0-9]/g, "");
//         if (currentStep === SignUpStep.UserPassword) {
//           setPassword(passwordNumber);
//         } else {
//           setConfirmPassword(passwordNumber);
//         }
//         break;
//       case SignUpStep.StartFaceRecognition:
//         if (lowerCommand.includes("시작")) {
//           nextStep();
//         }
//         break;
//       case SignUpStep.FaceRecognitionInProgress:
//         if (lowerCommand.includes("사진") || lowerCommand.includes("찍어")) {
//           openCamera();
//         }
//         break;
//       case SignUpStep.FaceRecognitionComplete:
//         if (lowerCommand.includes("완료")) {
//           await handleSignUp();
//         }
//         break;
//       case SignUpStep.Login:
//         if (lowerCommand.includes("로그인")) {
//           await handleLogin();
//         }
//         break;
//       default:
//         // NLP 처리
//         try {
//           const response = await sendToNLP(command);
//           if (response && response.text) {
//             console.log("nlp로 보내고 돌아온 데이터입니다: ", response.text);
//             await handleVoiceCommand(response.text);
//           } else {
//             console.error(
//               "Received an unexpected response from NLP API: ",
//               response,
//             );
//           }
//         } catch (error) {
//           console.error("nlp 보내는데 문제생김: ", error);
//         }
//     }

//     resetTranscript();
//   };

//   const handleNext = async () => {
//     switch (currentStep) {
//       case SignUpStep.UserPhone:
//         await handleSendSms();
//         break;
//       case SignUpStep.SmsVerification:
//         await handleVerifySms();
//         break;
//       case SignUpStep.ConfirmPassword:
//         handlePasswordConfirmation();
//         break;
//       default:
//         nextStep();
//     }
//   };

//   const handleSendSms = async () => {
//     try {
//       await sendPhoneNumber(phone);
//       setError(null);
//       nextStep();
//     } catch (error) {
//       setError("SMS 전송에 실패했습니다. 다시 시도해주세요.");
//     }
//   };

//   const handleVerifySms = async () => {
//     try {
//       const response = await verificationCodeCheck(phone, smsCode);
//       if (response.status === "인증이 되었습니다.") {
//         setError(null);
//         nextStep();
//       } else {
//         setError("인증 코드가 일치하지 않습니다. 다시 시도해주세요.");
//       }
//     } catch (error) {
//       setError("SMS 인증에 실패했습니다. 다시 시도해주세요.");
//     }
//   };

//   const handlePasswordConfirmation = () => {
//     if (password !== confirmPassword) {
//       setError("비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
//       setStep(SignUpStep.UserPassword);
//       setPassword("");
//       setConfirmPassword("");
//     } else {
//       nextStep();
//     }
//   };

//   const handleSignUp = async () => {
//     try {
//       const signUpData = {
//         userName: name,
//         userPhone: phone,
//         userPassword: password,
//       };
//       await signup(signUpData, faceImage);
//       nextStep();
//     } catch (error) {
//       setError("회원가입에 실패했습니다. 다시 시도해주세요.");
//     }
//   };

//   const handleLogin = async () => {
//     try {
//       const loginDto = {
//         phone,
//         password: faceImage ? undefined : password,
//       };
//       const response = await login(loginDto, faceImage);
//       if (response.status === "SUCCESS") {
//         navigate("/main");
//       } else {
//         setError("로그인에 실패했습니다. 다시 시도해주세요.");
//       }
//     } catch (error) {
//       setError("로그인에 실패했습니다. 다시 시도해주세요.");
//     }
//   };

//   // FaceRecognitionStep.tsx에서 가져온 로직
//   const openCamera = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setFaceImage(file);
//       nextStep(); // 사진 촬영 후 다음 단계로 자동 이동
//     }
//   };

//   // NLP 처리
//   // try {
//   //   const response = await sendToNLP(command);
//   //   if (response && response.text) {
//   //     console.log("nlp로 보내고 돌아온 데이터입니다: ", response.text);
//   //     await handleVoiceCommand(response.text);
//   //   } else {
//   //     console.error("Received an unexpected response from NLP API: ", response);
//   //   }
//   // } catch (error) {
//   //   console.error("nlp 보내는데 문제생김: ", error);
//   // } finally {
//   //   resetTranscript();
//   // }

//   return (
//     <div>
//       <button onClick={() => setIsListening(!isListening)}>
//         {isListening ? "음성 인식 중지" : "음성 인식 시작"}
//       </button>
//       {error && <p>{error}</p>}
//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleImageChange}
//         className="hidden"
//         ref={fileInputRef}
//         capture="user"
//       />
//     </div>
//   );
// };

// export default VoiceCommand;

// // import React, { useEffect } from "react";
// // import SpeechRecognition, {
// //   useSpeechRecognition,
// // } from "react-speech-recognition";
// // import useUserStore from "./useUserStore";
// // import { SignUpStep } from "./User.types";

// // const VoiceCommand: React.FC = () => {
// //   const { transcript, resetTranscript } = useSpeechRecognition();
// //   const { currentStep, nextStep, prevStep, setStep } = useUserStore();

// //   useEffect(() => {
// //     SpeechRecognition.startListening({ continuous: true, language: "ko-KR" });
// //     return () => {
// //       SpeechRecognition.stopListening();
// //     };
// //   }, []);

// //   useEffect(() => {
// //     handleVoiceCommands(transcript);
// //   }, [transcript]);

// //   const handleVoiceCommands = (transcript: string) => {
// //     const lowerCaseTranscript = transcript.toLowerCase();

// //     if (
// //       lowerCaseTranscript.includes("다음") ||
// //       lowerCaseTranscript.includes("넘어가기")
// //     ) {
// //       nextStep();
// //       resetTranscript();
// //     } else if (
// //       lowerCaseTranscript.includes("이전") ||
// //       lowerCaseTranscript.includes("되돌아가기")
// //     ) {
// //       prevStep();
// //       resetTranscript();
// //     } else if (lowerCaseTranscript.includes("시작")) {
// //       if (
// //         currentStep === SignUpStep.Welcome ||
// //         currentStep === SignUpStep.StartFaceRecognition
// //       ) {
// //         nextStep();
// //         resetTranscript();
// //       }
// //     } else if (lowerCaseTranscript.includes("완료")) {
// //       if (currentStep === SignUpStep.FaceRecognitionComplete) {
// //         setStep(SignUpStep.SignUpComplete);
// //         resetTranscript();
// //       }
// //     } else if (lowerCaseTranscript.includes("로그인")) {
// //       if (currentStep === SignUpStep.SignUpComplete) {
// //         setStep(SignUpStep.Login);
// //         resetTranscript();
// //       }
// //     }
// //   };

// //   return null; // This component doesn't render anything
// // };

// // export default VoiceCommand;

// // // // VoiceCommand.tsx
// // // import React, { useEffect } from 'react';
// // // import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// // // import useUserStore from './useUserStore';

// // // const VoiceCommand: React.FC = () => {
// // //   const { transcript, resetTranscript } = useSpeechRecognition();
// // //   const { nextStep } = useUserStore();

// // //   useEffect(() => {
// // //     SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
// // //     return () => {
// // //       SpeechRecognition.stopListening();
// // //     };
// // //   }, []);

// // //   useEffect(() => {
// // //     handleVoiceCommands(transcript);
// // //   }, [transcript]);

// // //   const handleVoiceCommands = (transcript: string) => {
// // //     const lowerCaseTranscript = transcript.toLowerCase();

// // //     if (lowerCaseTranscript.includes("다음") || lowerCaseTranscript.includes("넘어가기")) {
// // //       nextStep();
// // //       resetTranscript();
// // //     }
// // //     // 여기에 다른 음성 명령을 추가할 수 있습니다.
// // //   };

// // //   return <div />; // 빈 div 반환
// // // };

// // // export default VoiceCommand;
