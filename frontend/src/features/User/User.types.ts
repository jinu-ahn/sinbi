export enum SignUpStep {
  Welcome,
  UserName,
  UserPhone,
  UserPassword,
  ConfirmPassword,
  StartFaceRecognition,
  FaceRecognitionInProgress,
  FaceRecognitionComplete,
  SignUpComplete,
  Login,
  ServiceIntro
}

export interface UserState {
    currentStep: SignUpStep;
    name: string;
    phone: string;
    password: string;
    confirmPassword: string;
    faceImage: File | null;
  }

export interface UserActions {
    setName: (name: string) => void;
    setPhone: (phone: string) => void;
    setPassword: (password: string) => void;
    setConfirmPassword: (password: string) => void;
    setFaceImage: (image: File) => void;
    nextStep: () => void;
    prevStep: () => void;
    setStep: (step: SignUpStep) => void;
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
    grantType: string;
    accessToken: string;
    refreshToken: string;
    refreshTokenExpiresIn: number;
  }