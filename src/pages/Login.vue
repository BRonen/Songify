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
    console.log(email.value, password.value);
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
    console.log(email.value, password.value);
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
  <form @submit.prevent="login">
    <fieldset>
      <legend>login</legend>
      <label for="email">E-mail:</label>
      <input v-model="email" name="email" type="email" />

      <label for="password">Password:</label>
      <input v-model="password" name="password" type="password" />
    </fieldset>
    <a @click="loginWithGoogle" href="#">Login with google</a>
    <button type="submit">submit</button>
    <router-link to="/register">I don't have an account yet</router-link>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: clamp(25rem, 50vw, 40rem);
  margin: auto;
}
fieldset {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border: none;
}
fieldset legend {
  margin: 0 auto;
  font-size: 2rem;
}
fieldset label {
  text-align: left;
  width: 100%;
}
fieldset input {
  width: 100%;
}
a {
  display: block;
  margin: 1rem auto;
}
</style>
