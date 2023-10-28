<script setup lang="ts">
import { ref, onMounted } from "vue";
import { collection, getDocs, query } from "firebase/firestore";
import {
  firestore,
  formatTimestamp,
  getCurrentUser,
} from "../services/firebase";
import { useAuthStore } from "../stores/authStore";

const authStore = useAuthStore();
const playlists = ref<any[]>([]);

onMounted(async () => {
  const user = await getCurrentUser();
  const playlistsRef = collection(firestore, `${user.uid}/musics/playlists`);
  const q = query(playlistsRef);

  const { docs } = await getDocs(q);

  playlists.value = docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
});
</script>

<template>
  <router-link
    v-for="playlist of playlists"
    :to="`/playlist/${playlist.uid}`"
    class="playlist-card"
  >
    <h2>{{ playlist.name }}</h2>
    <span>{{ formatTimestamp(playlist.createdAt) }}</span>
  </router-link>
  <h2 v-if="!playlists.length">
    Welcome {{ authStore.profile?.displayName }}!
  </h2>
</template>

<style scoped>
.playlist-card {
  border-radius: 0.5rem;
  border: 1px solid gray;

  padding: 1rem 2rem;
  margin: 1rem 2rem;

  display: flex;
  justify-content: space-between;
  align-items: center;

  transition: all 250ms ease-in-out;
}
.playlist-card:hover {
  transform: scale(1.005);
  box-shadow: 0rem 0.5rem 0.3rem #00000011;
}
.playlist-card h2 {
  color: black;
  font-size: 1.2rem;
  text-decoration: none !important;
}
.playlist-card span {
  color: black;
  font-size: 1rem;
  text-decoration: 0;
}
h2 {
  text-align: center;
}
</style>
