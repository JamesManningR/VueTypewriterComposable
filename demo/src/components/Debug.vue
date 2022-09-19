<script setup lang="ts">
import { TypewriterState } from "../../../src/UseTypewriter";

type Props = {
  currentAction: TypewriterState;
  currentString: string;
  strings: string[];
  typedLength: number;
  stringIndex: number;
  iteration: number;
  typeInterval: number;
  deleteInterval: number;
  holdFor: number;
  holdEmptyFor: number;
  loop: boolean;
  iterations: number;
  isPaused: boolean;
  isAtLastLetter: boolean;
  isLastIteration: boolean;
  isPausingAtEnd: boolean;
  finishEmpty: boolean;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="debug">
    <blockquote>
      All of these are reactive, so you can use them in your own components.
      All options can be changed to adjust the behaviour of the typewriter dynamically.
    </blockquote>

    <div class="vars">
      <section>
        <h3>Strings in the list</h3>

        <ul>
          <li v-for="(string, index) in strings" @key="string"
            :class="{ active: index === stringIndex, deleting: index === stringIndex && currentAction === TypewriterState.Deleting }">
            {{ string }}</li>
        </ul>
      </section>

      <section class="state">
        <h3>State</h3>
        <table>
          <tr>
            <td>Current string(*)</td>
            <td>{{ currentString }}</td>
          </tr>
          <tr>
            <td>Current Action</td>
            <td>{{ currentAction }} ({{ TypewriterState[currentAction] }})</td>
          </tr>
          <tr>
            <td>Typed length</td>
            <td>{{ typedLength }}</td>
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
      </section>

      <section class="options">
        <h3>Options</h3>
        <table>
          <tr>
            <td>Type interval</td>
            <td>{{ typeInterval }}</td>
          </tr>
          <tr>
            <td>Delete interval</td>
            <td>{{ deleteInterval }}</td>
          </tr>
          <tr>
            <td>Hold for</td>
            <td>{{ holdFor }}</td>
          </tr>
          <tr>
            <td>Hold Empty for</td>
            <td>{{ holdEmptyFor }}</td>
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
            <td>Finish Empty</td>
            <td>{{ finishEmpty }}</td>
          </tr>
        </table>
      </section>
    </div>
  </div>
</template>

<style lang="scss">
.vars {
  display: flex;
  gap: 1em;
}

.active {
  color: green;
}

.deleting {
  color: red;
}
</style>
