import { reactive, toRefs, ref, computed, onMounted, onUnmounted } from 'vue'
import { MaybeRef } from '@vueuse/shared'
import { UseTypewriterOptions } from '../@types'

const useTypewriterOptionsDefaults: UseTypewriterOptions = {
  typeInterval: 100,
  deleteInterval: 50,
  holdFor: 1000,
  holdEmptyFor: 200,
  loop: true,
  iterations: 0,
  startEmpty: false,
  startPaused: false,
  finishEmpty: false,
}

export enum TypewriterStates {
  Typing,
  Deleting,
  Waiting,
  Complete,
}

/**
 * A compostable which creates a reactive text string, which is typed out one character at a time.
 * @param stringsArray An array of strings to be typed out.
 * @param options An object containing options for the typewriter.
 * @returns The text that is currently being typed out.
 */
export function useTypewriter (
  stringsArray: MaybeRef<string[]>,
  options: Partial<UseTypewriterOptions> = {},
) {
  // Emsure that strings is reactive
  const strings = ref(stringsArray)
  let replacementStrings: string[] | null

  // Validate strings array
  if (!Array.isArray(strings.value)) {
    throw new TypeError('Words must be an array of strings.')
  } else if (strings.value.length === 0) {
    throw new Error('Words array must contain at least one string.')
  }

  // Set up reactive variables for options
  const {
    typeInterval,
    deleteInterval,
    holdFor,
    holdEmptyFor,
    loop,
    iterations,
    finishEmpty,
  } = toRefs(
    reactive({
      ...useTypewriterOptionsDefaults,
      ...options,
    }),
  )

  // Set up the unreactive startPaused variable
  const startPaused =
    options.startPaused ?? useTypewriterOptionsDefaults.startPaused

  // Setup initial state
  /**
   * The current action of the typewriter. (Typing, Deleting, Waiting)
   */
  const currentAction = ref(TypewriterStates.Typing)

  /**
   * Whether the typewriter is paused or not
   */
  const isPaused = ref(startPaused)

  /**
   * The current index of the string being typed out.
   */
  const stringIndex = ref(0)

  /**
   * The current length of the text to output.
   */
  const typedLength = ref(0)

  /**
   * The current iteration of the typewriter.
   */
  const iteration = ref(1)

  /**
   * Whether the typewriter will be pausing at the end of the current string.
   */
  const isPausingAtEnd = ref(false)

  /**
   *  whether the typewriter is currently using the last string
   */
  const isAtLastString = computed(
    () => stringIndex.value === strings.value.length - 1,
  )

  /**
   * Whether the typewriter is currently using the last character of the current string
   */
  const isAtLastLetter = computed(
    () => typedLength.value >= currentString.value.length,
  )

  /**
   * If the typewriter is currently using the first character of the current string
   */
  const isLastIteration = computed(
    () =>
      !loop.value ||
      (iterations.value !== 0 && iteration.value >= iterations.value),
  )

  // All functions run sequentially, so we can use a single timeout
  let timer: ReturnType<typeof setTimeout>

  /**
   * The current string being used
   */
  const currentString = computed(() => strings.value[stringIndex.value])

  /**
   * The resulting text that is currently being typed out.
   */
  const text = computed(() => {
    const string = currentString.value

    if (!string) {
      // eslint-disable-next-line no-console
      console.warn(
        "Wasn't able to find a string to type out. Resetting to first string.",
      )

      reset()
      return
    }
    if (string.length < typedLength.value) {
      // eslint-disable-next-line no-console
      console.warn(
        'The current string is shorter than the typed length. Resetting to first string.',
      )
    }

    return string.slice(0, typedLength.value)
  })

  /**
   * Types the next letter, or sets up the waiting state if at the end of the word.
   */
  function type () {
    // Check to see if were at the end of the word.
    if (isAtLastLetter.value) {
      // If we are at the end of the word, we need to pause.
      currentAction.value = TypewriterStates.Waiting

      // If we're finishing with the last word
      // And we're at the last iteration or we're looping not looping
      // And we're pausing at the end of the last word word
      // then we need to stop the typewriter.
      if (isAtLastString.value && isLastIteration.value && !finishEmpty.value) {
        end()
        return
      }

      if (isPausingAtEnd.value) {
        isPausingAtEnd.value = false
        isPaused.value = true
        currentAction.value = TypewriterStates.Deleting
      } else if (holdFor.value === 0) {
        // After the pause, we need to delete the word.
        resetWord()
      } else {
        timer = setTimeout(resetWord, holdFor.value)
      }
    } else {
      // If we are not at the end of the word, we need to type the next character.
      typedLength.value++

      // Set a timeout to type the next character.
      timer = setTimeout(type, typeInterval.value)
    }
  }

  /**
   * Deletes the next letter, or sets up the waiting state if at the start of the word.
   */
  function deleteLetter () {
    // Set the current action to deleting
    currentAction.value = TypewriterStates.Deleting
    // Check to see if we are at the beginning of the word.
    if (typedLength.value === 0) {
      // After the pause, we need to type the next word.
      nextWord()
    } else {
      // If we are not at the beginning of the word, we need to delete the last character.
      typedLength.value--

      // Set a timeout to delete the next character.
      timer = setTimeout(deleteLetter, deleteInterval.value)
    }
  }

  /**
   * Setup up the next word in
   */
  function nextWord () {
    // Check if there are strings to replace the current strings
    if (replacementStrings) {
      _updateStringsFromReplacements()
      return
    }

    // Set the state to typing
    currentAction.value = TypewriterStates.Typing

    // Check to see if we are at the end of the words array.
    if (isAtLastString.value) {
      // If we are at the end of the words array, we need to check if we are looping.
      if (loop.value) {
        // If we have reached the iteration limit, we need to stop typing.
        if (isLastIteration.value) {
          end()
          return
        }

        // If we have not reached the iteration limit, we need to increment the iteration count.
        iteration.value++
      } else {
        // If we are not looping, we need to stop typing.
        end()
      }
    }

    // If we are not at the end of the words array, we need to increment the String index.
    stringIndex.value = (stringIndex.value + 1) % strings.value.length

    // Set a timeout to type the next word if it's not instant
    if (holdEmptyFor.value === 0) {
      type()
    } else {
      timer = setTimeout(type, holdEmptyFor.value)
    }
  }

  /**
   * Starts the process for deleting the current string.
   */
  function resetWord () {
    // Set the state to deleting
    currentAction.value = TypewriterStates.Deleting

    // Set a timeout to delete the next character.
    timer = setTimeout(deleteLetter, deleteInterval.value)
  }

  function reset (typeOverride?: boolean) {
    // Reset the state of the typewriter
    // While keeping the refed values
    stringIndex.value = 0
    typedLength.value = 0
    iteration.value = 1

    // If we want to type, we need to start the typewriter.
    if (typeOverride) {
      type()
      return
    }

    // Start paused if the startPaused prop is true
    if (startPaused) {
      isPaused.value = true
    } else if (finishEmpty.value) {
      type()
    } else {
      deleteLetter()
    }
  }

  /**
   * Pause current opperation and hold the current text.
   */
  function pause () {
    isPaused.value = true
    // Clear the timeout
    clearTimeout(timer)
  }

  /**
   * Pause the operation once the current string is finished.
   */
  function pauseAtEndOfWord () {
    isPausingAtEnd.value = true
  }

  /**
   * Resume the current opperation.
   * or in the case of complete restart the typewriter.
   */
  function play () {
    isPaused.value = false
    // Continue with the typewriter based on the state
    switch (currentAction.value) {
      case TypewriterStates.Typing:
        type()
        break
      case TypewriterStates.Deleting:
        deleteLetter()
        break
      case TypewriterStates.Waiting:
        resetWord()
        break
      case TypewriterStates.Complete:
        // If our complete state is a full word
        if (typedLength.value !== 0) {
          // We need to start the word deleting
          resetWord()
        } else {
          // Otherwise we need to start the array again
          reset()
        }
        break
      default:
        reset()
        break
    }
  }

  /**
   * Loads the end state of the typewriter.
   */
  function end () {
    currentAction.value = TypewriterStates.Complete
    pause()
    isPausingAtEnd.value = false
    iteration.value = 1

    if (finishEmpty.value) {
      stringIndex.value = 0
    }
  }

  /**
   * Update the strings array safely by finishing the deletion of the current string.
   * Then updating the array.
   * @param newStrings Strings to update the current array to
   */
  function updateStrings(newStrings: string[]) {
    // validate the array
    if (!newStrings || newStrings.length === 0) {
      throw new Error('The strings array is empty.')
    }

    // See if we can quick change the strings without queuing
    if (typedLength.value === 0) {
      strings.value = newStrings
      return
    }

    // If we are in the middle of typing, we need to wait until the current string is finished.
    // Then we can update the strings array.
    replacementStrings = newStrings
  }

  /**
   * Update the strings array safely by finishing the deletion of the current string.
   * Then updating the array.
   * @param newStrings Strings to update the current array to
   * @deprecated since v1.0.7 use updateStrings instead
   */
  function safeUpdateStrings (newStrings: string[]) {
    updateStrings(newStrings)
  }

  /**
   * Utility function to replace the current strings array.
   */
  function _updateStringsFromReplacements () {
    if (replacementStrings && replacementStrings.length > 0) {
      strings.value = replacementStrings
      replacementStrings = null

      reset(true)
    }
  }

  onMounted(() => {
    // If start empty is false
    if (!options.startEmpty) {
      // At the index to the end of the string and start by waiting
      stringIndex.value = strings.value.length - 1
      currentAction.value = TypewriterStates.Waiting
    } else {
      // Otherwise start by typing
      currentAction.value = TypewriterStates.Typing
    }
    // Start the typewriter
    if (!options.startPaused) {
      play()
    }
  })

  onUnmounted(() => {
    // Clear the typewriter timer
    clearTimeout(timer)
  })

  // expose managed state as return value
  return {
    text,
    strings,
    currentString,
    currentAction,
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
    isAtLastString,
    isLastIteration,
    isPausingAtEnd,
    finishEmpty,
    pause,
    pauseAtEndOfWord,
    play,
    safeUpdateStrings,
  }
}

export type UseTypewriterReturn = ReturnType<typeof useTypewriter>;
