<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  addDoc,
  collection,
  getDocs,
  query,
  Timestamp,
} from "firebase/firestore";
import router from "../routes";
import {
  firestore,
  formatTimestamp,
  getCurrentUser,
} from "../services/firebase";

const files = ref<any[]>([]);
const selectedFiles = ref<any[]>([]);

const createPlaylist = async (event: any) => {
  const user = await getCurrentUser();
  const playlistRef = collection(firestore, `${user.uid}/musics/playlists/`);
  await addDoc(playlistRef, {
    name: event.target?.name.value,
    musics: selectedFiles.value,
    createdAt: Timestamp.now(),
  });
  router.push("/");
};

onMounted(async () => {
  const user = await getCurrentUser();
  const musicsRef = collection(firestore, `${user.uid}/musics/files`);

  const q = query(musicsRef);

  const { docs } = await getDocs(q);

  files.value = docs.map((doc) => doc.data());
});

const selectFile = (name: string) => {
  const fileIndex = files.value.findIndex((file: any) => file.name === name);
  selectedFiles.value.push(files.value[fileIndex]);
  files.value = files.value.filter((file: any) => file.name !== name);
};

const unselectFile = (name: string) => {
  const fileIndex = selectedFiles.value.findIndex(
    (file: any) => file.name === name,
  );
  files.value.push(selectedFiles.value[fileIndex]);
  selectedFiles.value = selectedFiles.value.filter(
    (file: any) => file.name !== name,
  );
};
</script>

<template>
  <main>
    <form
      @submit.prevent="createPlaylist"
      :style="{ display: 'flex', flexDirection: 'column' }"
    >
      <input name="name" />
      <div v-if="selectedFiles.length">
        <p v-for="selectedFile in selectedFiles">
          {{ selectedFile.name }}
          <span @click="unselectFile(selectedFile.name)">x</span>
        </p>
      </div>
      <button>submit</button>
    </form>

    <table>
      <thead>
        <tr>
          <th>Action</th>
          <th>Name</th>
          <th>Author</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="file in files">
          <td><button @click="selectFile(file.name)">add</button></td>
          <td>{{ file.name }}</td>
          <td>{{ file.author }}</td>
          <td>{{ formatTimestamp(file.createdAt) }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style scoped>
main {
  display: flex;
}

form {
  max-width: 50%;
  margin: 1rem auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

form input {
  font-size: 1.2rem;

  padding: 0.3rem 0.5rem;
}

form div {
  display: flex;
  justify-content: center;

  gap: 2rem;
}

form div p {
  border-radius: 0.5rem;
  background-color: #dddddc;
  padding: 0 1rem;
}

form div p span {
  font-size: 1.25rem;
  margin-left: 0.5rem;
  cursor: pointer;
}

form button {
  width: 50%;
  margin: 0 auto;
}

table {
  max-width: 50%;
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
}

table button:hover {
  box-shadow: 0px 0px 6px #dddddc inset;
}
</style>
