import { User } from "firebase/auth";
import { defineStore } from "pinia";
import { ref } from "vue";
import { fireauth } from "../services/firebase";
import router from "../routes";
import usePlayerStore from "./playerStore";

export const useAuthStore = defineStore("auth", () => {
  const profile = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const playerStore = usePlayerStore();

  const logout = async () => {
    await fireauth.signOut();

    profile.value = null;
    playerStore.playlist = null;
    playerStore.currentTrack = null;

    router.push("/login");
  };

  return { profile, isAuthenticated, logout };
});
