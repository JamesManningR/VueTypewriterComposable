<script setup lang="ts">
import { ref } from "vue";
import { useTypewriter } from '../../src/UseTypewriter';
import Debug from "./components/Debug.vue"

const strings = ref([
  "Hello world!", 
  "Привіт Світ!",
  "Hei Verden!",
  "Czescz świecie!",
  "Saluton mondo",
  "Bonjour le monde!",
  "こんにちは世界",
  "你好世界 !",
])

const {     
  text,
  currentAction,
  currentString,
  stringIndex,
  charIndex,
  iteration,
  typeInterval,
  deleteInterval,
  holdFor,
  loop,
  iterations,
  isPaused,
  isAtLastLetter,
  isLastIteration,
  isPausingAtEnd,
  pauseAtEndOfWord,
  pause,
  play
} = useTypewriter(strings, {
  deleteInterval: 50,
  typeInterval: 100,
});
</script>

<template>
<div class="demo">
  <h2>
    &nbsp;{{ text }}
  </h2>

  <form @submit.prevent class="controls">
    <button type="button" @click="play" :disabled="!isPaused">Play</button>
    <button type="button" @click="pause" :disabled="isPaused">Pause</button>
    <button type="button" @click="pauseAtEndOfWord" :disabled="isPausingAtEnd">Pause at end</button>
  </form>

  <Debug 
    :currentString="currentString"
    :currentAction="currentAction"
    :charIndex="charIndex"
    :stringIndex="stringIndex"
    :iteration="iteration"
    :strings="strings"
    :typeInterval="typeInterval"
    :deleteInterval="deleteInterval"
    :holdFor="holdFor"
    :loop="loop"
    :iterations="iterations"
    :words="strings"
    :isPaused="isPaused"
    :isAtLastLetter="isAtLastLetter"
    :isLastIteration="isLastIteration"
    :isPausingAtEnd="isPausingAtEnd"
  />
</div>
</template>

<style lang="scss"></style>