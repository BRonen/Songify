import { ref } from 'vue'
import { defineStore } from 'pinia'
import { doc, getDoc, Timestamp } from 'firebase/firestore'
import { firestorage, firestore, getCurrentUser } from '../services/firebase'
import { getDownloadURL, ref as sref, StorageReference } from 'firebase/storage'

export type TrackData = {
    id: number
    name: string
    author: string
    storagePath: string
    createdAt: Timestamp
}

export type Playlist = {
    name: string
    musics: TrackData[]
    createdAt: Timestamp
}

export type Track = {
    data: TrackData
    ref: StorageReference
    src: string
}

const playlistConverter = {
    toFirestore: (data: Playlist) => data,
    fromFirestore: (snap: any) => snap.data() as Playlist
}

export const usePlayerStore = defineStore('player', () => {
    const currentDuration = ref<number>(0.0)
    const duration = ref<number>(0.0)

    const isLoading = ref<boolean>(true)
    const isPlaying = ref<boolean>(false)

    const playlist = ref<Playlist | null>(null)
    const currentTrack = ref<Track | null>(null)

    const loadPlaylist = async (playlistId: string) => {
        const user = await getCurrentUser()

        const playlistRef = doc(
            firestore, `${user.uid}/musics/playlists/${playlistId}`
        ).withConverter(playlistConverter)

        const playlistSnapshot = await getDoc(playlistRef)
        
        const playlistData = playlistSnapshot.data()

        playlist.value = playlistData? {
            ...playlistData,
            musics: playlistData.musics.map((music, index) => ({...music, id: index}))
        } : null
        
        isLoading.value = false

        if(!playlist.value?.musics[0]) return

        const trackRef = sref(firestorage, playlist.value?.musics[0].storagePath)

        currentTrack.value = {
            data: playlist.value.musics[0],
            ref: trackRef,
            src: await getDownloadURL(trackRef),
        }
    }

    const setCurrentTrack = async (id: number) => {
        const trackData = playlist.value?.musics.find(music => music.id === id)

        if(!trackData)
            throw new Error('Track not found')

        const trackRef = sref(firestorage, trackData.storagePath)

        currentTrack.value = {
            data: trackData,
            ref: trackRef,
            src: await getDownloadURL(trackRef)
        }
    }

    return {
        currentDuration,
        duration,
        currentTrack,
        playlist,
        isLoading,
        isPlaying,
        loadPlaylist,
        setCurrentTrack,
    }
})

export default usePlayerStore