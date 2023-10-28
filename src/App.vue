<script setup lang="ts">
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import { getCurrentUser } from "./services/firebase";
import { useAuthStore } from "./stores/authStore";

const authStore = useAuthStore();

getCurrentUser().then((user) => {
  authStore.profile = user;
});
</script>

<template>
  <Header v-if="authStore.profile" />
  <router-view />
  <Footer v-if="authStore.profile" />
</template>
