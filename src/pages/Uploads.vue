<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { collection, getDocs, query } from 'firebase/firestore'
import { firestore, formatTimestamp, getCurrentUser } from '../services/firebase'

const files = ref<any[]>([]);

onMounted(async () => {
    const user = await getCurrentUser()
    const filesRef = collection(firestore, `${user.uid}/musics/files`)
    const q = query(filesRef)

    const { docs } = await getDocs(q)
    
    files.value = docs.map( doc => ({ uid: doc.id, ...doc.data() }) )
    console.log(files.value)
})
</script>

<template>
    <router-link to="/uploads/new">
        <button>+</button>
    </router-link>
    <table v-if="files">
        <thead>
            <th>name</th>
            <th>author</th>
            <th>createdAt</th>
        </thead>
        <tbody>
            <tr v-for="file in files">
                <td>{{ file.name }}</td>
                <td>{{ file.author }}</td>
                <td>{{ formatTimestamp(file.createdAt) }}</td>
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
    border-radius: .5rem;
}

table thead {
    background-color: #DDDDDC;
}

table tbody {
    background-color: #F0F0F0;
}

table thead th,
table tbody td {
    padding: .5rem 1rem;
    text-align: center;
}

table button {
    width: 100%;
}

table button:hover {
    box-shadow: 0px 0px 6px #DDDDDC inset;
}

a {
    display: block;
    text-align: right;
    width: 75%;
    margin: 2rem auto;
}
</style>