export enum SignUpStep {
  Welcome,
  UserName,
  UserPhone,
  SmsVerification,
  UserPassword,
  ConfirmPassword,
  StartFaceRecognition,
  FaceRecognitionInProgress,
  FaceRecognitionComplete,
  SignUpComplete,
  Login,
  ServiceIntro,
}

export interface UserState {
  currentStep: SignUpStep;
  name: string;
  phone: string;
  password: string;
  confirmPassword: string;
  faceImage: File | undefined;
  smsCode: string;
  error: string | null;
  isAudioPlaying: boolean;
}

export interface UserActions {
  setName: (name: string) => void;
  setPhone: (phone: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  setFaceImage: (image: File |undefined) => void;
  setError: (error: string | null) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: SignUpStep) => void;
  setSmsCode: (code: string) => void; // SMS 코드 설정 액션 추가
  setIsAudioPlaying: (isPlaying: boolean) => void;
}

export interface SignUpDto {
  userName: string;
  userPhone: string;
  userPassword: string;
}

export interface LoginDto {
  phone: string;
  password?: string;
}

export interface TokenDto {
  status: string;
  data: string; // "SUCCESS" 문자열이 여기에 들어갑니다.
}

// OTPCredential 타입 정의
export interface OTPCredential extends Credential {
  code: string ; // OTP 인증번호
}