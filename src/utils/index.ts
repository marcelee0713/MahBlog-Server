export const arraysEqual = <T>(arr1: T[], arr2: T[]): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((element, index) => element === arr2[index]);
};

export const safeExecute = async <T, Args extends unknown[]>(
  fn: (...args: Args) => T | Promise<T>, // Allow synchronous or asynchronous functions
  ...args: Args
): Promise<T | null> => {
  try {
    // If the function returns a promise, await it. Otherwise, directly return the result.
    const result = fn(...args);
    return result instanceof Promise ? await result : result;
  } catch (error) {
    return null;
  }
};
