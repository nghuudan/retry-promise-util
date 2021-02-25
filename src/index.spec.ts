import { retryPromise } from '.';

describe('retryPromise', () => {
  const errorMock = new Error('error');
  const resolveMock = () => Promise.resolve('test');
  const rejectMock = () => Promise.reject(errorMock);

  it('should return a promise', () => {
    expect(retryPromise(resolveMock)).toBeInstanceOf(Promise);
  });

  it('should resolve with the value from the promise function', async () => {
    expect(await retryPromise(resolveMock)).toBe('test');
  });

  it('should reject with the retry promise error message', async () => {
    try {
      await retryPromise(rejectMock);
    } catch (error) {
      expect(error.message).toBe('Maximum retries reached');
    }
  });

  it('should reject with the original error message in the error', async () => {
    try {
      await retryPromise(rejectMock);
    } catch (error) {
      expect(error.originalErrorMessage).toBe(errorMock.message);
    }
  });

  it('should try for the number of retries in options', async () => {
    let totalCount = 0;
    try {
      await retryPromise(() => {
        totalCount += 1;
        return Promise.reject(errorMock);
      }, { delay: 10, multiplier: 2, retries: 5 });
    } catch {
      expect(totalCount).toBe(6);
    }
  });
});
