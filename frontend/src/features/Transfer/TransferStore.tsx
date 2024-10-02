import { create } from "zustand";

interface Account {
  id: string;
  accountNum: string;
  bankType: string;
  productName: string;
  amount: number;
}

interface FavAccount {
  bankType: string;
  id: number;
  recvAccountNum: string;
  recvAlias: string;
  recvName: string;
}

interface TransferStore {
  step: number;
  myAccountId: number;
  favAccountId: number;
  sendAccountNum: string;
  sendBankType: string;
  money: string;
  formalName: string;
  nickName: string;
  error: string | null;
  accounts: Account[]; // Store for all accounts
  favAccounts: FavAccount[]; // Store for all accounts
  setStep: (step: number) => void;
  setMyAccountId: (type: number) => void;
  setFavAccountId: (type: number) => void;
  setSendAccountNum: (num: string) => void;
  setSendBankType: (type: string) => void;
  setSendMoney: (num: string) => void;
  setFormalName: (type: string) => void;
  setNickName: (type: string) => void;
  setError: (message: string | null) => void;
  setAccounts: (accounts: Account[]) => void;
  setFavAccounts: (accounts: FavAccount[]) => void;
}

export const useTransferStore = create<TransferStore>((set) => ({
  step: 0, // 0단계에서 시작
  myAccountId: 0,
  favAccountId: 0,
  sendAccountNum: "", // 계좌번호 (디폴트값은 빈 string)
  sendBankType: "", // 무슨은행인지 (디폴트값은 빈 string)
  money: "",
  formalName: "",
  nickName: "",
  error: null,
  accounts: [], // Initialize accounts array
  favAccounts: [], // Initialize accounts array
  setStep: (step: number) => set({ step }),
  setMyAccountId: (type: number) => set({ myAccountId: type }),
  setFavAccountId: (type: number) => set({ favAccountId: type }),
  setSendAccountNum: (num: string) => set({ sendAccountNum: num }), // user가 지정하면 바뀜
  setSendBankType: (type: string) => set({ sendBankType: type }), // user가 지정하면 바뀜
  setSendMoney: (num: string) => set({ money: num }),
  setFormalName: (type: string) => set({ formalName: type }),
  setNickName: (type: string) => set({ nickName: type }),
  setError: (message) => set({ error: message }),
  // Function to set accounts globally
  setAccounts: (accounts: Account[]) => set({ accounts }),
  setFavAccounts: (favAccounts: FavAccount[]) => set({ favAccounts }),
}));
