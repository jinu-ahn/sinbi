import { useStore } from "zustand";
import {createStore} from "zustand/vanilla";

interface UserState {
  name: string | null;
  phoneNumber: string | null;
  webAuthnCredentialId: string | null;
  setUser: (user: { name: string; phoneNumber: string; webAuthnCredentialId?: string }) => void;
  clearUser: () => void;
}

// export const useUserStore = create<UserState>((set) => ({
//   name: null,
//   phoneNumber: null,
//   webAuthnCredentialId: null,
//   setUser: (user) => set(user),
//   clearUser: () => set({ name: null, phoneNumber: null, webAuthnCredentialId: null }),
// }));


const store = createStore<UserState>((set) => ({
  name: null,
  phoneNumber: null,
  webAuthnCredentialId: null,
  setUser: (user) => set(user),
  clearUser: () => set({ name: null, phoneNumber: null, webAuthnCredentialId: null }),
}));

export const useUserStore = () => useStore(store);