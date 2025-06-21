// store/userInfoStore.ts
import { create } from 'zustand';

export const useUserInfo = create(set => ({
  userInfo: { age: '', district: '', gender: '', householdType: '' },
  setUserInfo: (info) => set({ userInfo: info }),
}));