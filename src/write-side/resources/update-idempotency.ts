/* eslint-disable no-continue */
import deepEqual from 'deep-equal';

export const isEmpty = <
T extends Record<string, unknown>,
>(object: T): boolean => Object.keys((object)).length === 0;

type ChangedFields = <C extends Record<string, unknown>>(command: C)
=> (state: Partial<C>)
=> Partial<C>;

export const changedFields: ChangedFields = (command) => (state) => {
  const result: Partial<typeof command> = {};

  let key: keyof typeof command;
  // eslint-disable-next-line no-loops/no-loops, no-restricted-syntax
  for (key in command) {
    if (command[key] === undefined) {
      continue;
    }
    if (!Object.prototype.hasOwnProperty.call(state, key)) {
      continue;
    }
    if (deepEqual(command[key], state[key as keyof typeof state])) {
      continue;
    }
    result[key] = command[key];
  }

  return result;
};
