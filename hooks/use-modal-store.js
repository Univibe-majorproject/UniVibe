//hook to control all modal in our application
import { create } from "zustand";

export const ModalType = "createServer";

export const useModal = create((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type) => set({ isOpen: true, type }),
  onClose: () => set({ type: null, isOpen: false }),
}));
