export function shuffleArray (array: any[]): any[] {
  // Fisher-Yates shuffle
  const shuffledArray = [...array]

  // For each element in the array (from the end to the beginning)
  for (let i = array.length - 1; i > 0; i--) {
    // Pick a random other element before the current element
    const j = Math.floor(Math.random() * (i + 1))

    // Swap the elements
    const newVal = shuffledArray[i]
    shuffledArray[i] = shuffledArray[j]
    shuffledArray[j] = newVal
  }

  // return the resulting array
  return shuffledArray
}
