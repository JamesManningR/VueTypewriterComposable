// Options
export interface UseTypewriterOptions {
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
