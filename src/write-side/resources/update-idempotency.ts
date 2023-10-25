/* eslint-disable no-continue */
import deepEqual from 'deep-equal';

export const isEmpty = <
T extends Record<string, unknown>,
>(object: T): boolean => Object.keys((object)).length === 0;

type ChangedFields = <I extends string, C extends Record<string, unknown> & Record<I, unknown>>(command: C, idField: I)
=> (state: Omit<C, I>)
=> Omit<Partial<C>, I>;

export const changedFields: ChangedFields = (command, idField) => (state) => {
  const result: Partial<typeof command> = {};

  let key: keyof typeof command;
  // eslint-disable-next-line no-loops/no-loops, no-restricted-syntax
  for (key in command) {
    if (command[key] === undefined) {
      continue;
    }
    if (key === idField) {
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
