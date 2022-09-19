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

const exampleReplacementStrings = [
  "Goodbye world!",
  "Пока Світ!",
];

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
  holdEmptyFor,
  loop,
  iterations,
  isPaused,
  isAtLastLetter,
  isLastIteration,
  isPausingAtEnd,
  finishEmpty,
  pauseAtEndOfWord,
  pause,
  play,
  safeUpdateStrings
} = useTypewriter(strings);
</script>

<template>
<div class="demo">
  <h2>
    {{ text || `&nbsp` }}
  </h2>

  <details @submit.prevent class="controls">
    <summary>Controls</summary>
    <fieldset>
      <h3>Functions</h3>
      <button type="button" @click="play" :disabled="!isPaused">Play</button>
      <button type="button" @click="pause" :disabled="isPaused">Pause</button>
      <button type="button" @click="pauseAtEndOfWord" :disabled="isPausingAtEnd">Pause at end</button>
      <button type="button" @click="safeUpdateStrings(exampleReplacementStrings)">Safe Replace</button>
    </fieldset>

    <fieldset>
      <h3>Timing</h3>

      <label>
        Type Interval(ms):
        <input type="number" required min="1" v-model="typeInterval" />
      </label>
      <label>
        Delete Interval(ms):
        <input type="number" required min="1" v-model="deleteInterval" />
      </label>
      <label>
        Hold For(ms):
        <input type="number" required min="1" v-model="holdFor" />
      </label>
      <label>
        Hold Empty For(ms):
        <input type="number" required min="1" v-model="holdEmptyFor" />
      </label>
    </fieldset>

    <fieldset>
      <h3>Loop behaviour</h3>

      <label>
        Loop:
        <input type="checkbox" v-model="loop" />
      </label>
      <label v-if="loop">
        Iterations:
        <input type="number" v-model="iterations" />
      </label>
    </fieldset>
  </details>

  <details>
    <summary>Debug</summary>
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
      :holdEmptyFor="holdEmptyFor"
      :finishEmpty="finishEmpty"
    />
  </details>

</div>
</template>

<style lang="scss">
details {
  margin-bottom: 1em;
}

.controls {
  fieldset {
    display: flex;
    gap: 0 1em;
    flex-wrap: wrap;
    margin-bottom: 1em;

    h3 {
      margin-top: 0;
      width: 100%;
    }

    label {
      margin-top: 0;
      width: calc(25% - .75em);
    }
  }
}
</style>