<script setup lang="ts">
import { ref } from 'vue'
import { useTypewriter } from '../../src/useTypewriter'

import AppHeader from './components/app/AppHeader.vue'
import AppFooter from './components/app/AppFooter.vue'
import AppDebug from './components/AppDebug.vue'

const strings = ref([
  'Hello world!',
  'Привіт Світ!',
  'Hei Verden!',
  'Czesć świecie!',
  'Saluton mondo',
  'Bonjour le monde!',
  'こんにちは世界',
  '你好世界 !',
])

const exampleReplacementStrings = [
  'Goodbye world!',
  'Пока Світ!',
  'Farvel verden!',
  'Żegnaj świecie!',
  'adiaŭ mondo!',
  'au revoir monde!',
  'さよならワールド',
  '好世界',
]

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
  safeUpdateStrings,
} = useTypewriter(strings)
</script>

<template>
  <div class="demo">
    <AppHeader />

    <h2 :aria-label="currentString">
      <span aria-hidden="true">
        {{ text || `&nbsp;` }}
      </span>
    </h2>

    <details class="controls" @submit.prevent>
      <summary>Controls</summary>
      <fieldset>
        <h3>Functions</h3>
        <button type="button" :disabled="!isPaused" @click="play">
          Play
        </button>
        <button type="button" :disabled="isPaused" @click="pause">
          Pause
        </button>
        <button
          type="button"
          :disabled="isPausingAtEnd"
          @click="pauseAtEndOfWord"
        >
          Pause at end
        </button>
        <button
          type="button"
          @click="safeUpdateStrings(exampleReplacementStrings)"
        >
          Safe Replace
        </button>
      </fieldset>

      <fieldset>
        <h3>Timing</h3>

        <label>
          Type Interval(ms):
          <input v-model="typeInterval" type="number" required min="1">
        </label>
        <label>
          Delete Interval(ms):
          <input v-model="deleteInterval" type="number" required min="1">
        </label>
        <label>
          Hold For(ms):
          <input v-model="holdFor" type="number" required min="0">
        </label>
        <label>
          Hold Empty For(ms):
          <input v-model="holdEmptyFor" type="number" required min="0">
        </label>
      </fieldset>

      <fieldset>
        <h3>Loop behaviour</h3>

        <label>
          Loop:
          <input v-model="loop" type="checkbox">
        </label>
        <label v-if="loop">
          Iterations:
          <input v-model="iterations" type="number">
        </label>
      </fieldset>
    </details>

    <details>
      <summary>Debug</summary>
      <AppDebug
        :current-string="currentString"
        :current-action="currentAction"
        :typed-length="typedLength"
        :string-index="stringIndex"
        :iteration="iteration"
        :strings="strings"
        :type-interval="typeInterval"
        :delete-interval="deleteInterval"
        :hold-for="holdFor"
        :loop="loop"
        :iterations="iterations"
        :words="strings"
        :is-paused="isPaused"
        :is-at-last-letter="isAtLastLetter"
        :is-last-iteration="isLastIteration"
        :is-pausing-at-end="isPausingAtEnd"
        :hold-empty-for="holdEmptyFor"
        :finish-empty="finishEmpty"
      />
    </details>

    <AppFooter />
  </div>
</template>

<style lang="scss">
h2 {
  font-size: 4em;
}

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
      width: calc(25% - 0.75em);
    }
  }
}
</style>
