import { create } from 'zustand';
import { Preferences } from '@capacitor/preferences';

const useAuthStore = create((set) => ({
  currentUser: null,
  userUid: null,
  isLoading: true,
  // Simplificamos la función de logout para solo limpiar el estado y las preferencias.
  logout: async () => {
    await Preferences.remove({ key: 'userUid' });
    set({ currentUser: null, userUid: null, isLoading: false });
  },
  // Función para establecer el usuario actual basado en el uid guardado.
  setUserUid: async () => {
    const result = await Preferences.get({ key: 'userUid' });
    if (result.value) {
      set({ currentUser: { uid: result.value }, userUid: result.value, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;