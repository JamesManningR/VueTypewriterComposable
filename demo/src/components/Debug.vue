<script setup lang="ts">
import { TypewriterState } from "../../../src/UseTypewriter";

type Props = {
  currentAction: TypewriterState;
  currentString: string;
  strings: string[];
  charIndex: number;
  stringIndex: number;
  iteration: number;
  typeInterval: number;
  deleteInterval: number;
  holdFor: number;
  loop: boolean;
  iterations: number;
  isPaused: boolean;
  isAtLastLetter: boolean;
  isLastIteration: boolean;
  isPausingAtEnd: boolean;
}

const props = defineProps<Props>();
</script>

<template>
<div class="debug">
  <div class="strings">
    <h2>Strings in the list</h2>

    <ul>
      <li 
        v-for="(string, index) in strings"
        @key="string"
        :class="{ active: index === stringIndex, deleting: index === stringIndex && currentAction === TypewriterState.Deleting }"
      >{{ string }}</li>
    </ul>
  </div>

  <div class="vars">
    <h2>Reactive Vars</h2>
    <code>
      Letters in current string: {{ strings[stringIndex].length }}
      Current letter: {{ strings[stringIndex][charIndex] }}
    </code>
    <table>
      <tr>
        <td>current string</td>
        <td>{{ currentString }}</td>
      </tr>
      <tr>
        <td>Current Action</td>
        <td>{{ currentAction }} ({{ TypewriterState[currentAction] }})</td>
      </tr>
      <tr>
        <td>Char index</td>
        <td>{{ charIndex }}</td>
      </tr>
      <tr>
        <td>String index</td>
        <td>{{ stringIndex }}</td>
      </tr>
      <tr>
        <td>Iteration</td>
        <td>{{ iteration }}</td>
      </tr>
      <tr>
        <td>Type interval</td>
        <td>{{ typeInterval }}</td>
      </tr>
      <tr>
        <td>Delete interval</td>
        <td>{{ deleteInterval }}</td>
      </tr>
      <tr>
        <td>Pause for</td>
        <td>{{ holdFor }}</td>
      </tr>
      <tr>
        <td>Loop</td>
        <td>{{ loop }}</td>
      </tr>
      <tr>
        <td>Iterations</td>
        <td>{{ iterations }}</td>
      </tr>
      <tr>
        <td>Is paused</td>
        <td>{{ isPaused }}</td>
      </tr>
      <tr>
        <td>Is at last letter</td>
        <td>{{ isAtLastLetter }}</td>
      </tr>
      <tr>
        <td>Is last iteration</td>
        <td>{{ isLastIteration }}</td>
      </tr>
      <tr>
        <td>Is pausing at end</td>
        <td>{{ isPausingAtEnd }}</td>
      </tr>
    </table>
  </div>
</div>
</template>

<style lang="scss">
.debug {
  display: flex;
  gap: 2em;
}

.active {
  color: green;
}
.deleting {
  color: red;
}
</style>
