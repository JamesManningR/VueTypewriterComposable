# Typer Composable

[NPM Package](https://www.npmjs.com/package/@altgen/typer-composable)

[Demo](https://jamesmanningr.github.io/VueTypewriterComposable/)

A Typewriter style composable which animates the typing of the typewriter and assigns it to a reactive variable

## Usage

### Instalation

```bash
// Yarn Install
yarn add @altgen/typer-composable

// Npm Install
npm i @altgen/typer-composable --save

// PNPM Install
pnpm i @altgen/typer-composable --save
```

Initialise the useTypewriter using a reactive or non reactive array of strings. If the array is reactive, then this will bind and follow the state of the typewriter.

### Simple

If you just want to start a typewriter and have it type out a string, then you can just pass it a list of strings. This can be reactive or non reactive. ( the reactive version is shown below )

```vue
<script setup lang="ts">
  import { ref } from 'vue';

  import { useTypewriter } from '@altgen/typer-composable';

  const strings = ref([
    'Hello world!',
    'Привіт Світ!',
    'Hei Verden!',
    'Czesć świecie!',
    'Saluton mondo',
    'Bonjour le monde!',
    'こんにちは世界',
    '你好世界 !',
  ]);

  const {
    text,
    currentString,
  } = useTypewriter(strings);
</script>

This can be used to bind to any attibute, or alternatively as html content
I would recommend generally not using the results of this string for accessibility attributes, but if it's a must, here is an example.
<template>
<div :aria-label="currentString">
  <span aria-hidden="true">{{ text }}<span>
</div>
<template>
```

### Advanced

This composable comes with many options and reactive return values to make it interaction rich.

To see all of the options available, please see the [types file](@types/index.d.ts).

```ts
interface UseTypewriterOptions {
  /**
   * The amount of time|ms) between each character being typed out.
   *
   * @default 100
   */
  typeInterval: number;

  /**
   * The amount of time|ms) between each character being deleted.
   *
   * @default 50
   */
  deleteInterval: number;

  /**
   * The amount of time(ms) to hold on once the word has been typed out.
   *
   * @default 1000
   */
  holdFor: number;

  /**
   * The amount of time(ms) to hold on once the word has been deleted.
   *
   * @default 200
   */
  holdEmptyFor: number;

  /**
   * Whether or not to loop the typewriter after the last word has been typed out.
   *
   * @default true
   */
  loop: boolean;

  /**
   * How many times to loop the typewriter. (0 = loop forever)
   *
   * @default 0
   */
  iterations: number;

  /**
   * Whether or not to start the typewriter as an empty string.
   * (if false, the typewriter will start with the first word in the array)
   *
   * @default false
   */
  startEmpty: boolean;

  /**
   * Whether to start the typewriter paused and wait for it to be triggered.
   * If true, the typewriter will not start until the `start` function is called
   * If fasle, the typewriter will start immediately.
   *
   * @default false
   *
   */
  startPaused: boolean;

  /**
   * Should we finish at an emptry string? if false then finish with the last word typed out.
   *
   * @default false
   */
  finishEmpty: boolean;
}
```

#### Returns

The useTypewriter composable exposes many reactive values to allow for interaction with the typewriter. As well as some functions to control the typewriter.

All of these values are reactive, and can be used in templates, or in other reactive functions. As well as to adjut the functionality of the typewriter on the fly, without re-initialising.

```ts
interface UseTypewriterReturns {
  /**
   * The current string being typed out.
   */
  text: Computed<string>;
  /**
   * The array of strings to be typed out.
   * @note This is reactive and can be changed at anytime, however,
   * I would recommend using the `updateStrings` method to update the strings,
   * to avoid any unexpected changes in the text
   */
  strings: Ref<string[]>;
  /**
   * The full current string being typed out without any clipping
   */
  currentString: Ref<string>;
  /**
   * The current state of the typewriter (typing, deleting, waiting, complete)
   * Use the Typewriter action enum to interact with this
   */
  currentAction: Ref<TypewriterAction>;
  /**
   * The current string index that is being typed out
   */
  stringIndex: Ref<number>;
  /**
   * The length of the string as it is typed. I would have opted for 'charIndex' as a key, but this would not be accurate as setting the index to 0 would still show the first character.
   */
  typedLength: Ref<number>;
  /**
   * The current iteration of the typewriter - each time the typewriter loops, this will increment by 1
   */
  iteration: Ref<number>;
  /**
   * The time (in ms) between each letter being typed
   */
  typeInterval: Ref<number>;
  /**
   * The time (in ms) between each letter being deleted
   */
  deleteInterval: Ref<number>;
  /**
   * The time (in ms) to hold on once the word has been typed out
   */
  holdFor: Ref<number>;
  /**
   * The time (in ms) to hold on once the word has been deleted
   */
  holdEmptyFor: Ref<number>;
  /**
   * Whether or not to loop the typewriter after the last word has been typed out
   */
  loop: Ref<boolean>;
  /**
   * How many times to loop the typewriter. (0 = loop forever)
   */
  iterations: Ref<number>;
  /**
   * Whether or not the typewriter is currently paused
   */
  isPaused: Ref<boolean>;
  /**
   * Whether or not the typewriter is currently at the last letter of the string
   */
  isAtLastLetter: Computed<boolean>;
  /**
   *
   * Whether or not the typewriter is currently at the last letter of the string
   */
  isAtLastString: Computed<boolean>;
  /**
   * Whether or not the typewriter is currently on its last itteration
   */
  isLastIteration: Computed<boolean>;
  /**
   * Whether or not the typewriter is set to pause once the last letter has been typed out
   */
  isPausingAtEnd: Ref<boolean>;
  /**
   * Whether or not the typewriter will shuffle once the last word in the itteration has been typed out
  */
  willShuffle: Ref<boolean>;
  /**
   * Whether or not the typewriter is to end on an empty string
   */
  finishEmpty: Ref<boolean>;
  /**
   * Pause the typewriter where it is
   */
  pause: () => void;
  /**
   * Pause once the current word has been typed out
   */
  pauseAtEndOfWord: () => void;
  /**
    * Shuffle the strings array after the current word has been typed out
   */
  shuffle: () => void;
  /*
   * Resume the typewriter from where it is
   * If the typewriter is complete, it will restart
   */
  play: () => void;
  /**
   * Update the strings once the typewriter is has deleted the current string
   * This will then start from string index 0
   */
  updateStrings: (strings: MaybeRef<string[]>) => void;
}
```

### Known Issues

1 known issue is that the reactive strings array can be changed without warning. This can sometimes cause the current word to change when the typewriter is in the middle of typing a word. I've handled any errors where the strings array is too short or the current word is too short by resetting the typewriter to the start of the word. To avoid this issue, I recommend using the `updateStrings` function to update the strings array. I'm hoping to find a lean way of using the `updateStrings` as the default update function in the future.
