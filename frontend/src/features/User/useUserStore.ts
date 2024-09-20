import { create } from "zustand";
import { UserState, UserActions, SignUpStep } from "./User.types";

const useUserStore = create<UserState & UserActions>((set) => ({
  currentStep: SignUpStep.Welcome,
  name: "",
  phone: "",
  password: "",
  confirmPassword: "",
  faceImage: null,

  setName: (name) => set({ name }),
  setPhone: (phone) => set({ phone }),
  setPassword: (password) => set({ password }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
  setFaceImage: (image) => set({ faceImage: image }),

  nextStep: () =>
    set((state) => ({
      currentStep: (state.currentStep + 1) as SignUpStep,
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(0, state.currentStep - 1) as SignUpStep,
    })),

  setStep: (step: SignUpStep) => set({ currentStep: step }),
}));

export default useUserStore;
