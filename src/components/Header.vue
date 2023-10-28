<script setup lang="ts">
import { useAuthStore } from "../stores/authStore";

const authStore = useAuthStore();
</script>

<template>
  <header>
    <router-link to="/">Home</router-link>
    <nav>
      <router-link to="/uploads">Uploads</router-link>
      <router-link to="/playlist/new">Playlists</router-link>
    </nav>
    <button @click="authStore.logout">Logout</button>
  </header>
</template>

<style scoped>
header {
  background-color: #f5f5f5;

  padding: 1.5rem 2rem;

  display: flex;
  justify-content: space-between;
}

header a:hover {
  text-decoration: underline;
}

header nav {
  display: flex;
  gap: 1rem;
}

header button {
  border: 1px solid #e0e0e0;
}
</style>
