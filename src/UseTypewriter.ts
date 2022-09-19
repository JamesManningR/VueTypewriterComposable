import { toRefs } from "@vueuse/core";
import { MaybeRef } from "@vueuse/shared";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { UseTypewriterOptions } from "../@types/index";

const useTypewriterOptionsDefaults = {
  typeInterval: 100,
  deleteInterval: 50,
  holdFor: 1000,
  loop: true,
  iterations: 0,
  startEmpty: false,
  startPaused: false,
  finishWithLastWord: false
};

export enum TypewriterState {
  Typing,
  Deleting,
  Waiting,
}

/**
 * A compostable which creates a reactive text string, which is typed out one character at a time.
 * @param stringsArray An array of strings to be typed out.
 * @param options An object containing options for the typewriter.
 * @returns The text that is currently being typed out.
 */
export function useTypewriter(
  stringsArray: MaybeRef<string[]>,
  options: Partial<UseTypewriterOptions> = {}
) {
  // Emsure that strings is reactive
  const strings = ref(stringsArray);

  // Validate strings array
  if (!Array.isArray(strings.value)) {
    throw new Error("Words must be an array of strings.");
  } else if (strings.value.length === 0) {
    throw new Error("Words array must contain at least one string.");
  }

  // Set up reactive variables for options
  const { typeInterval, deleteInterval, holdFor, loop, iterations, finishWithLastWord } = toRefs({
    ...useTypewriterOptionsDefaults,
    ...options,
  });

  // Setup initial state
  /**
   * The current action of the typewriter. (Typing, Deleting, Waiting)
   */
  const currentAction = ref(TypewriterState.Typing);

  /**
   * Whether the typewriter is paused or not
   */
  const isPaused = ref(
    options.startPaused || useTypewriterOptionsDefaults.startPaused
  );

  /**
   * The current index of the string being typed out.
   */
  const stringIndex = ref(0);

  /**
   * The current index of the character being typed out.
   */
  const charIndex = ref(0);
  
  /**
   * The current iteration of the typewriter.
   */
  const iteration = ref(0);

  /**
   * Whether the typewriter will be pausing at the end of the current string.
   */
  const isPausingAtEnd = ref(false);

  /**
   *  whether the typewriter is currently using the last string
   */ 
  const isAtLastString = computed(() => stringIndex.value === strings.value.length - 1);
  
  /**
   * Whether the typewriter is currently using the last character of the current string
    */
  const isAtLastLetter = computed(() => charIndex.value === strings.value[stringIndex.value].length - 1);
  
  /**
   * If the typewriter is currently using the first character of the current string
   */
  const isLastIteration = computed(() => iterations.value !== 0 && loop.value && iteration.value >= iterations.value);

  // All functions run sequentially, so we can use a single timeout
  let timer: ReturnType<typeof setTimeout>;

  /**
   * The current string being used
   */
  const currentString = computed(() => strings.value[stringIndex.value]);

  /**
   * The resulting text that is currently being typed out.
   */
  const text = computed(() => {
    const string = currentString.value;

    if (charIndex.value === 0) return "";

    return string.slice(0, charIndex.value + 1);
  });

  /**
   * Types the next letter, or sets up the waiting state if at the end of the word.
   */
  function type() {
    // Check to see if were at the end of the word.
    if (isAtLastLetter.value) {
      // If we are at the end of the word, we need to pause.
      currentAction.value = TypewriterState.Waiting;

      // If we're finishing with the last word
      // And we're at the last iteration or we're looping not looping
      // And we're pausing at the end of the last word word
      // then we need to stop the typewriter.
      if (isAtLastString.value && isLastIteration.value && finishWithLastWord.value) {
        return
      }
      
      if (isPausingAtEnd.value) {
        isPausingAtEnd.value = false;
        isPaused.value = true;
        currentAction.value = TypewriterState.Deleting;
      } else {
        // After the pause, we need to delete the word.
        timer = setTimeout(resetWord, holdFor.value);
      }
    } else {
      // If we are not at the end of the word, we need to type the next character.
      charIndex.value++;

      // Set a timeout to type the next character.
      timer = setTimeout(type, typeInterval.value);
    }
  }

  /**
   * Deletes the next letter, or sets up the waiting state if at the start of the word.
   */
  function deleteLetter() {
    // Check to see if we are at the beginning of the word.
    if (charIndex.value === 0) {
      // After the pause, we need to type the next word.
      timer = setTimeout(nextWord, holdFor.value);
    } else {
      // If we are not at the beginning of the word, we need to delete the last character.
      charIndex.value--;

      // Set a timeout to delete the next character.
      timer = setTimeout(deleteLetter, deleteInterval.value);
    }
  }

  /**
   * Setup up the next word in
   */
  function nextWord() {
    // Set the state to typing
    currentAction.value = TypewriterState.Typing;

    // Check to see if we are at the end of the words array.
    if (isAtLastString.value) {
      // If we are at the end of the words array, we need to check if we are looping.
      if (loop.value) {
        // If we have reached the iteration limit, we need to stop typing.
        if (isLastIteration.value) return;

        // If we have not reached the iteration limit, we need to increment the iteration count.
        iteration.value++;
      } else {
        // If we are not looping, we need to stop typing.
        return;
      }
    }

    // If we are not at the end of the words array, we need to increment the String index.
    stringIndex.value = (stringIndex.value + 1) % strings.value.length;

    // Set a timeout to type the next word.
    timer = setTimeout(type, holdFor.value);
  }

  /**
   * Starts the process for deleting the current string.
   */
  function resetWord() {
    // Set the state to deleting
    currentAction.value = TypewriterState.Deleting;

    // Set a timeout to delete the next character.
    timer = setTimeout(deleteLetter, deleteInterval.value);
  }

  /**
   * Pause current opperation and hold the current text.
   */
  function pause() {
    isPaused.value = true;
    // Clear the timeout
    clearTimeout(timer);
  }

  /**
   * Pause the operation once the current string is finished.
   */
  function pauseAtEndOfWord() {
    isPausingAtEnd.value = true;
  }

  /**
   * Resume the current opperation.
   */
  function play() {
    isPaused.value = false;
    // Continue with the typewriter based on the state
    switch (currentAction.value) {
      case TypewriterState.Typing:
        type();
        break;
      case TypewriterState.Deleting:
        deleteLetter();
        break;
      case TypewriterState.Waiting:
        resetWord();
        break;
    }
  }

  onMounted(() => {
    // Start the typewriter
    if (!options.startPaused) {
      type();
    }
  });

  onUnmounted(() => {
    // Clear the typewriter timer
    clearTimeout(timer);
  });

  // expose managed state as return value
  return {
    text,
    currentString,
    currentAction,
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
    isAtLastString,
    isLastIteration,
    isPausingAtEnd,
    pause,
    pauseAtEndOfWord,
    play,
  };
}
