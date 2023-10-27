<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ref as sref, uploadBytes } from 'firebase/storage'
import { firestorage, firestore, getCurrentUser } from '../services/firebase'
import { addDoc, collection, getDocs, query, Timestamp } from 'firebase/firestore'
import router from '../routes';

const files = ref<any[]>([])

onMounted(async () => {
    const user = await getCurrentUser()
    const musicsRef = collection(firestore, `${user.uid}/musics/files`)

    const q = query(musicsRef)

    files.value = (await getDocs(q)).docs.map(doc => doc.data())
    console.log(files.value)
})

async function upload(event: any) {
    const user = await getCurrentUser()
    const storageRef = sref(firestorage, `user_files/${user.uid}/${event.target.name.value}`)

    const fileSnapshot = await uploadBytes(storageRef, event.target?.music.files[0])
    
    const musicsRef = collection(firestore, `${user.uid}/musics/files`)

    await addDoc(musicsRef, {
        name: event.target.name.value,
        author: event.target.author.value,
        storagePath: fileSnapshot.metadata.fullPath,
        createdAt: Timestamp.now(),
    })

    const q = query(musicsRef)

    const { docs } = await getDocs(q)

    console.log('wasd')

    files.value = docs.map(doc => ({ uid: doc.id, ...doc.data() }))
    await router.push('/uploads')
}
</script>

<template>
    <form @submit.prevent="upload">
        <input type="text" name="name" placeholder="Name:"/>
        <input type="text" name="author" placeholder="Author:"/>
        <input type="file" name="music"/>
        <button>submit</button>
    </form>
</template>

<style scoped>
form {
    max-width: 50%;
    margin: 1rem auto;
    display: flex;
    flex-direction: column;
    gap: .5rem;
}

form input {
    font-size: 1.2rem;

    padding: .3rem .5rem;
}

form button {
    width: 50%;
    margin: 0 auto;
}
</style>