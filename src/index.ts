export class RetryPromiseError extends Error {
  /** Message from the original error */
  originalErrorMessage: string;

  /**
   * Creates a RetryPromiseError including the original error message
   * @param error original error to include
   */
  constructor(error: Error) {
    super('Maximum retries reached');
    this.originalErrorMessage = error?.message;
  }
}

export type RetryPromiseFunction<T = void> = () => Promise<T>;

export interface RetryPromiseOptions {
  /** Delay between each retry in milliseconds */
  delay?: number;
  /** Multiplier for the delay after each retry */
  multiplier?: number;
  /** Number of retries if the promise function is rejected */
  retries?: number;
}

/**
 * Retries a function returning a promise with a delay between each retry
 * @param promiseFn function returning a promise
 * @param options delay in milliseconds, multiplier, and retries
 * @default options { delay: 1000, multiplier: 1, retries: 3 }
 */
export const retryPromise = <T = void>(
  promiseFn: RetryPromiseFunction<T>,
  options?: RetryPromiseOptions,
) => {
  const {
    delay,
    multiplier,
    retries,
  }: RetryPromiseOptions = {
    delay: 1000,
    multiplier: 1,
    retries: 3,
    ...options,
  };
  return new Promise<T>((resolve, reject) => {
    promiseFn().then(resolve).catch((error) => {
      if (retries > 0) {
        setTimeout(() => {
          retryPromise(promiseFn, {
            delay: delay * multiplier,
            retries: retries - 1,
            multiplier,
          }).catch(reject);
        }, delay);
      } else {
        reject(new RetryPromiseError(error));
      }
    });
  });
};

export default retryPromise;
