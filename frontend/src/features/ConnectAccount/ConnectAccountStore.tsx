import { create } from "zustand";

interface ConnectAccountStore {
  step: number;
  accountNum: string;
  bankType: string;
  phoneNum: string;
  verificationCode: string;
  setStep: (step: number) => void;
  setAccountNum: (num: string) => void;
  setBankType: (type: string) => void;
  setPhoneNum: (num: string) => void;
  setVerificationCode: (num: string) => void;
}

export const useConnectAccountStore = create<ConnectAccountStore>((set) => ({
  step: 0, // 0단계에서 시작
  accountNum: "", // 계좌번호 (디폴트값은 빈 string)
  bankType: "", // 무슨은행인지 (디폴트값은 빈 string)
  phoneNum: "",
  verificationCode: "",
  setStep: (step: number) => set({ step }),
  setAccountNum: (num: string) => set({ accountNum: num }), // user가 지정하면 바뀜
  setBankType: (type: string) => set({ bankType: type }), // user가 지정하면 바뀜
  setPhoneNum: (num: string) => set({ phoneNum: num }),
  setVerificationCode: (num: string) => set({ verificationCode: num }),
}));
