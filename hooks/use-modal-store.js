//hook to control all modal in our application 
import { create } from "zustand";

export const ModalType = "createServer" | "invite" | "editServer" | "members";


export const useModal = create((set) => ({
   type: null,
   data: {},
   isOpen: false,
   onOpen: (type, data = {}) => set({ isOpen: true, type, data}),
   onClose: ()=> set({type:null, isOpen: false}) 
}));