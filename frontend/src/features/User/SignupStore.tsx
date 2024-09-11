import create from "zustand";

interface SignupStore {
  step: number;
  setStep: (step: number) => void;
}

export const useSignupStore = create<SignupStore>((set) => ({
  step: 0, // initial step
  setStep: (step: number) => set({ step }), // function to update the step
}));