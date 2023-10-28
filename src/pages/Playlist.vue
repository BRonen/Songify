<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import usePlayerStore from "../stores/playerStore";
import { formatTimestamp } from "../services/firebase";

const { playlistId } = useRoute().params;
const playerStore = usePlayerStore();

const { setCurrentTrack } = playerStore;

onMounted(() => playerStore.loadPlaylist(playlistId as string));
</script>

<template>
  <div v-if="playerStore.playlist" class="title">
    <h1>{{ playerStore.playlist.name }}</h1>
    <p>{{ formatTimestamp(playerStore.playlist.createdAt) }}</p>
  </div>

  <table v-if="playerStore.playlist">
    <thead>
      <th>actions</th>
      <th>name</th>
      <th>author</th>
      <th>createdAt</th>
    </thead>
    <tbody>
      <tr v-for="music in playerStore.playlist.musics">
        <td><button @click="setCurrentTrack(music.id)">play</button></td>
        <td>{{ music.name }}</td>
        <td>{{ music.author }}</td>
        <td>{{ formatTimestamp(music.createdAt) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 1rem 2rem;
}

.title h1 {
  font-size: 2rem;
}

.title p {
  font-size: 1rem;
}

table {
  width: 75%;
  margin: 1rem auto;
  border-radius: 0.5rem;
}

table thead {
  background-color: #dddddc;
}

table tbody {
  background-color: #f0f0f0;
}

table thead th,
table tbody td {
  padding: 0.5rem 1rem;
  text-align: center;
}

table button {
  width: 100%;
}

table button:hover {
  box-shadow: 0px 0px 6px #dddddc inset;
}
</style>
