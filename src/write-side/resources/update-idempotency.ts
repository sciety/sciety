/* eslint-disable no-restricted-syntax */
/* eslint-disable no-loops/no-loops */
export const isEmpty = <T extends Record<string, unknown>>(object: T): boolean => Object.keys(object).length === 0;

type KeysOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T];

type RequiredKeys<T> = Exclude<KeysOfType<T, Exclude<T[keyof T], undefined>>, undefined>;

type PropertiesThatCanBeUndefined<T extends Record<string, unknown>> = Omit<T, RequiredKeys<T>>;

type ChangedFields = <C extends Record<string, unknown>>(command: C)
=> (state: PropertiesThatCanBeUndefined<C>)
=> Required<PropertiesThatCanBeUndefined<C>>;

export const changedFields: ChangedFields = (command) => (state) => {
  const result = command;
  for (const key in state) {
    if (command[key] === state[key]) { result[key] = undefined; }
  }
  return result;
};
