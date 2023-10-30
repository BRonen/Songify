<script setup lang="ts">
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ref } from "vue";
import router from "../routes";
import { fireauth } from "../services/firebase";
import { useAuthStore } from "../stores/authStore";

const authStore = useAuthStore();

const email = ref("");
const password = ref("");

async function loginWithGoogle() {
  try {
    const credentials = await signInWithPopup(
      fireauth,
      new GoogleAuthProvider(),
    );
    authStore.profile = credentials.user;
    router.push("/");
  } catch (error: any) {
    switch (error.code) {
      case "auth/invalid-email":
        console.error("Invalid email");
        break;
      case "auth/user-not-found":
        console.error("No account with that email was found");
        break;
      case "auth/wrong-password":
        console.error("Incorrect password");
        break;
      default:
        console.error(error);
        break;
    }
  }
}

async function login() {
  try {
    const credentials = await signInWithEmailAndPassword(
      fireauth,
      email.value,
      password.value,
    );
    authStore.profile = credentials.user;
    await router.push("/");
  } catch (error: any) {
    switch (error.code) {
      case "auth/invalid-email":
        console.error("Invalid email");
        break;
      case "auth/user-not-found":
        console.error("No account with that email was found");
        break;
      case "auth/wrong-password":
        console.error("Incorrect password");
        break;
      default:
        console.error(error);
        break;
    }
  }
}
</script>

<template>
  <form
    @submit.prevent="login"
    class="bg-latte-mantle border border-latte-surface-300 px-2/7 py-12"
  >
    <fieldset class="py-4 px-8 rounded-md flex flex-col">
      <legend class="text-2xl font-bold">login</legend>
      <label for="email">E-mail:</label>
      <input
        v-model="email"
        name="email"
        type="email"
        placeholder="Email"
        class="rounded-sm mb-4"
      />

      <label for="password">Password:</label>
      <input
        v-model="password"
        name="password"
        type="password"
        placeholder="Password"
        class="rounded-sm"
      />
    </fieldset>
    <a @click="loginWithGoogle" href="#">Login with google</a>
    <button type="submit" class="bg-red-400 hover:bg-red-500">submit</button>
    <router-link to="/register">I don't have an account yet</router-link>
  </form>
</template>
