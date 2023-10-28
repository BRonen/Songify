<script setup lang="ts">
import { ref } from "vue";
import usePlayerStore from "../../stores/playerStore";

const playerStore = usePlayerStore();
const audioRef = ref<HTMLAudioElement | null>(null);

const onLoadedMetadata = () => {
  playerStore.duration = (audioRef.value?.duration || 0) * 100;
};

const onLoadedData = () => {
  playerStore.isLoading = false;

  if (playerStore.isPlaying) audioRef.value?.play();
};

const onCurrTime = () => {
  playerStore.currentDuration = (audioRef.value?.currentTime || 0) * 100;
};

const onMoveTime = (e: any) => {
  playerStore.currentDuration = e.target.value;

  if (audioRef.value) audioRef.value.currentTime = e.target.value;
};

const onMoveTimeBegin = () => audioRef.value?.pause();

const onMoveTimeEnd = () => {
  if (playerStore.isPlaying) audioRef.value?.play();
};

const onEnded = async () => {
  const { currentTrack } = playerStore;

  if (!currentTrack) return;

  try {
    await playerStore.setCurrentTrack(currentTrack.data.id + 1);
  } catch (e) {
    console.error(e);
    playerStore.isPlaying = false;
  }
};

const play = () => {
  audioRef.value?.play();
  playerStore.isPlaying = true;
};

const pause = () => {
  audioRef.value?.pause();
  playerStore.isPlaying = false;
};

const formatDuration = (duration: number) => {
  const { floor } = Math;
  const seconds = floor((duration / 100) % 60);
  const minutes = floor(duration / 100 / 60);
  //get 00:00 - 9999:60 time template
  const result = `${String(minutes).padStart(2, "0")}:${String(
    seconds,
  ).padStart(2, "0")}`;
  return result;
};
</script>

<template>
  <h1>{{ playerStore.currentTrack?.data.name || "Any music selected" }}</h1>
  <div class="player-wrapper">
    <button
      v-if="!playerStore.isLoading"
      @click="
        playerStore.setCurrentTrack(playerStore.currentTrack?.data.id! - 1)
      "
    >
      <img src="/assets/foward.svg" style="transform: rotate(180deg)" />
    </button>
    <button
      v-if="!playerStore.isLoading"
      @click="playerStore.isPlaying ? pause() : play()"
    >
      <img
        :src="playerStore.isPlaying ? '/assets/pause.svg' : '/assets/play.svg'"
      />
    </button>
    <button
      v-if="!playerStore.isLoading"
      @click="
        playerStore.setCurrentTrack(playerStore.currentTrack?.data.id! + 1)
      "
    >
      <img src="/assets/foward.svg" />
    </button>
    <p>
      {{ formatDuration(playerStore.currentDuration) }} -
      {{ formatDuration(playerStore.duration) }}
    </p>
    <input
      type="range"
      :max="playerStore.duration"
      :value="playerStore.currentDuration"
      @change="onMoveTime"
      @mousedown="onMoveTimeBegin"
      @mouseup="onMoveTimeEnd"
    />
  </div>
  <audio
    v-if="playerStore.currentTrack"
    @timeupdate="onCurrTime"
    @loadedmetadata="onLoadedMetadata"
    @loadeddata="onLoadedData"
    @ended="onEnded"
    :src="playerStore.currentTrack.src"
    preload="metadata"
    ref="audioRef"
  />
</template>

<style scoped>
img {
  height: 1rem;
  width: 1rem;
}
.player-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
