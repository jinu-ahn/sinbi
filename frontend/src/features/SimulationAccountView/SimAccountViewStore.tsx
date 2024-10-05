import { create } from "zustand";

interface Account {
  id: string;
  accountNum: string;
  bankType: string;
  productName: string;
  amount: number;
}

interface AccountViewStore {
  step: number;
  error: string | null;
  selectedAccount: Account | null;
  accounts: Account[]; // Store for all accounts
  setStep: (step: number) => void;
  setError: (message: string | null) => void;
  setSelectedAccount: (account: Account | null) => void;
  setAccounts: (accounts: Account[]) => void;
}

export const useSimAccountViewStore = create<AccountViewStore>((set) => ({
  step: 0,
  error: null,
  selectedAccount: null,
  accounts: [], // Initialize accounts array
  setStep: (step: number) => set({ step }),
  setError: (message) => set({ error: message }),
  setSelectedAccount: (account) => set({ selectedAccount: account }),
  
  // Function to set accounts globally
  setAccounts: (accounts: Account[]) => set({ accounts })
}));