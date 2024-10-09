import { create } from "zustand";
import {
  UserState,
  UserActions,
  SignUpStep,
  LoginDto,
  SignUpDto,
} from "./User.types";

type LoginFunction = (
  loginDto: LoginDto,
  faceImage?: File,
) => Promise<{ status: string }>;
type SignUpFunction = (signUpDto: SignUpDto, faceImage?: File) => Promise<void>;

const useUserStore = create<UserState & UserActions>((set) => ({
  currentStep: SignUpStep.Welcome,
  name: "",
  phone: "",
  smsCode: "",
  password: "",
  confirmPassword: "",
  faceImage: undefined,
  error: null,

  setName: (name) => set({ name }),
  setPhone: (phone) => set({ phone }),
  setSmsCode: (code) => set({ smsCode: code }),
  setPassword: (password) => set({ password }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
  setFaceImage: (image: File | undefined) => set({ faceImage: image }),
  setError: (error) => set({ error }),


  nextStep: () =>
    set((state) => ({
      currentStep: (state.currentStep + 1) as SignUpStep,
      error: null,
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(0, state.currentStep - 1) as SignUpStep,
      error: null,
    })),

  setStep: (step: SignUpStep) => set({ currentStep: step }),
  resetState: () =>
    set({
      currentStep: SignUpStep.Welcome,
      name: "",
      phone: "",
      smsCode: "",
      password: "",
      confirmPassword: "",
      faceImage: undefined,
      error: null,
    }),

  handleLogin: async (loginFunction: LoginFunction) => {
    try {
      const { phone, password, faceImage } = useUserStore.getState();
      const response = await loginFunction({ phone, password }, faceImage);
      if (response.status === "SUCCESS") {
        set({ error: null });
        return true;
      } else {
        set({ error: "로그인에 실패했습니다. 다시 시도해주세요." });
        return false;
      }
    } catch (error) {
      if (error instanceof Error) {
        set({ error: `로그인 중 오류가 발생했습니다: ${error.message}` });
      } else {
        set({ error: "로그인 중 알 수 없는 오류가 발생했습니다." });
      }
      return false;
    }
  },

  handleSignUp: async (signUpFunction: SignUpFunction) => {
    try {
      const { name, phone, password, faceImage } = useUserStore.getState();
      const signUpData = {
        userName: name,
        userPhone: phone,
        userPassword: password,
      };
      await signUpFunction(signUpData, faceImage);
      set({ error: null });
      return true;
    } catch (error) {
      if (error instanceof Error) {
        set({ error: `회원가입에 실패했습니다: ${error.message}` });
      } else {
        set({ error: "회원가입 중 알 수 없는 오류가 발생했습니다." });
      }
      return false;
    }
  },

  handlePasswordConfirmation: () => {
    const { password, confirmPassword, setError, setStep, nextStep } = useUserStore.getState();
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
      setStep(SignUpStep.UserPassword);
    } else {
      setError(null);
      nextStep();
    }
  },

  // useUserStore.ts에 추가
// isAudioPlaying: Boolean,
// setIsAudioPlaying: (isPlaying: boolean) => void,

// // 초기 상태 및 액션 추가
isAudioPlaying: false,
setIsAudioPlaying: (isPlaying) => set({ isAudioPlaying:isPlaying }),

// // 새로운 상태 및 액션 추가
// isAudioPlaying: false,
// setIsAudioPlaying: (isPlaying: boolean) => set({ isAudioPlaying }),
  
}));

export default useUserStore;
