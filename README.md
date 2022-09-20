# Typewriter Composable

A Typewriter style composable which animates the typing of the typewriter and assigns it to a reactive variable

## Usage

Initialise the useTypewriter using a reactive or non reactive array of strings. If the array is reactive, then this will bind and follow the state of the typewriter.

### Simple

```vue
<script setup lang=ts>
  import { ref } from "vue";

  import { useTypewriter } from "typewriter-composable";

  const strings = ref([
    "Hello world!", 
    "Привіт Світ!",
    "Hei Verden!",
    "Czescz świecie!",
    "Saluton mondo",
    "Bonjour le monde!",
    "こんにちは世界",
    "你好世界 !",
  ]);

  const {
    text,
    currentString,
  } = useTypewriter(strings);
</script>

<template>
<div :aria-label="currentString">
  <span aria-hidden="true">{{ text }}<span>
</div>
<template>
```

### Advanced

This composable comes with many options and reactive return values to make it interaction rich.

To see all of the options available, please see the [types file](@types/index.ts).

#### Returns

- `text` - The current text being typed
- `strings` - The strings to be typed
- `currentString` - The current string being typed
- `currentAction` - The current action taking place (typing, deleting, waiting, complete) If you want to interact with this one, use the `TypewriterState` enum
- `stringIndex` - The index of the current string being typed
- `typedLength` - The length of the word that has been typed (this was used rather than index since the slice method requires a length rather than an index, and 0 just ouputs the whole string)
- `iteration` - Each time that the typewriter runs trough all of the strings, this will increment by 1 starting at 1
- `typeInterval` - The interval (in ms) between each character being typed
- `deleteInterval` - The interval (in ms) between each character being deleted
- `holdFor` - The amount of time (in ms) that the typewriter will wait before deleting the string
- `holdEmptyFor` - The amount of time (in ms) that the typewriter will wait before typing the next string.
- `loop` - Whether to loop the typewriter or not if false it will stop at the last word.
- `iterations` - Reactive version of the prop of the same name, if this is set to 0, then the typewriter will loop forever.
- `isPaused` - Whether the typewriter is paused or not
- `isAtLastLetter` - If the typewriter is at the last letter of the current string
- `isAtLastString` - If the typewriter is at the last string in the array
- `isLastIteration` - If this is the last iteration.
- `isPausingAtEnd` - If the typewriter is pausing at the end of the string.
- `finishEmpty` - If the typewriters is set to finish the iteration as an empty string
- `pause()` - A function used to pause the typewriter in its place
- `pauseAtEndOfWord()` - A function used to pause once the typewriter has finished typing out the word
- `play()` - Function to continue the typewriter from where it was paused
- `safeUpdateStrings()` - Used to update the strings array safely once the typewriter has deleted the current string.