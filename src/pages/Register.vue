<script setup lang="ts">
import { ref } from "vue";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { fireauth, firestore } from "../services/firebase";
import router from "../routes";
import { useAuthStore } from "../stores/authStore";

const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const authStore = useAuthStore();

async function register() {
  try {
    const credentials = await createUserWithEmailAndPassword(
      fireauth,
      email.value,
      password.value,
    );

    await updateProfile(credentials.user, {
      displayName: username.value,
    });

    authStore.profile = credentials.user;

    const userRef = doc(firestore, "users", fireauth.currentUser?.uid!);

    await setDoc(userRef, {
      ownerId: fireauth.currentUser?.uid,
      username: username.value,
      email: email.value,
      createdAt: Timestamp.now(),
    });

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
  <form @submit.prevent="register">
    <fieldset>
      <legend>register</legend>
      <label for="username">Username:</label>
      <input v-model="username" name="username" type="name" />

      <label for="email">E-mail:</label>
      <input v-model="email" name="email" type="email" />

      <label for="password">Password:</label>
      <input v-model="password" name="password" type="password" />

      <label for="confirmPassword">Confirm password:</label>
      <input v-model="confirmPassword" name="confirmPassword" type="password" />
    </fieldset>
    <button type="submit">submit</button>
    <router-link to="/login">I already have an account</router-link>
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
form button {
  margin: 1rem 0;
}
a {
  display: block;
  margin: auto;
}
</style>
