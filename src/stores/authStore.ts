import type { User } from "firebase/auth";
import { defineStore } from "pinia";
import { ref } from "vue";
import { fireauth } from "../services/firebase";
import router from "../routes";
import usePlayerStore from "./playerStore";
import { getCurrentUser } from "../services/firebase";

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

  getCurrentUser().then(user => {
    profile.value = user;
  })

  return { profile, isAuthenticated, logout };
});
