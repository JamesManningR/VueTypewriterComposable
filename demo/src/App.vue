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
  typedLength,
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
  typeInterval: 1000,
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
    <label>
      Type Interval(ms):
      <input type="number" v-model="typeInterval" />
    </label>
    <label>
      Delete Interval(ms):
      <input type="number" v-model="deleteInterval" />
    </label>
    <label>
      Hold For(ms):
      <input type="number" v-model="holdFor" />
    </label>
    <label>
      Loop:
      <input type="checkbox" v-model="loop" />
    </label>
    <label v-if="!loop">
      Iterations:
      <input type="number" v-model="iterations" />
    </label>
  </form>

  <Debug 
    :currentString="currentString"
    :currentAction="currentAction"
    :typedLength="typedLength"
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