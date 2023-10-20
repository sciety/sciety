/* eslint-disable no-restricted-syntax */
/* eslint-disable no-loops/no-loops */
export const isEmpty = <T extends Record<string, unknown>>(object: T): boolean => Object.keys(object).length === 0;

const removeUndefined = <T extends Record<string, unknown>>(input: T): Partial<T> => {
  const result = input;
  for (const key in result) {
    if (result[key] === undefined) {
      delete result[key];
    }
  }
  return result;
};

type OnlyKeepUpdatedFields = <C extends Record<string, unknown>>(command: C) => <S extends C>(state: S) => Partial<C>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const onlyKeepUpdatedFields: OnlyKeepUpdatedFields = (command) => (state) => {
  const result: Partial<typeof command> = command;
  for (const key in command) {
    if (command[key] === state[key]) { result[key] = undefined; }
  }
  return removeUndefined(result);
};
