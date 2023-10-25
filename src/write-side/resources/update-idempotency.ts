/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-loops/no-loops */
import deepEqual from 'deep-equal';

const removeUndefined = <T extends Record<string, unknown>>(input: T): Partial<T> => {
  const result = input;
  for (const key in result) {
    if (result[key] === undefined) {
      delete result[key];
    }
  }
  return result;
};

export const isEmpty = <
T extends Record<string, unknown>,
>(object: T): boolean => Object.keys(removeUndefined(object)).length === 0;

type KeysOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T];

type RequiredKeys<T> = Exclude<KeysOfType<T, Exclude<T[keyof T], undefined>>, undefined>;

type PropertiesThatCanBeUndefined<T extends Record<string, unknown>> = Omit<T, RequiredKeys<T>>;

type ChangedFields = <I extends string, C extends Record<string, unknown> & Record<I, unknown>>(command: C, idField: I)
=> (state: PropertiesThatCanBeUndefined<C>)
=> Required<PropertiesThatCanBeUndefined<C>>;

// @ts-ignore
export const changedFields: ChangedFields = (command, idField) => (state) => {
  const result: Partial<typeof command> = {};

  for (const key in command) {
    // @ts-ignore
    if (deepEqual(command[key], state[key])) {
      result[key] = undefined;
    } else {
      result[key] = command[key];
    }
  }
  delete result[idField];
  return removeUndefined(result);
};
