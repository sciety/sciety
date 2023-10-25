/* eslint-disable no-continue */
import deepEqual from 'deep-equal';

import { pipe } from 'fp-ts/function';
import { DomainEvent, EventSpecificFields } from '../../domain-events';

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

type ToUpdatedEvent = <T extends DomainEvent>(command: Partial<EventSpecificFields<T['type']>>, blankEvent: T)
=> (state: Partial<EventSpecificFields<T['type']>>)
=> ReadonlyArray<T>;

export const toUpdatedEvent: ToUpdatedEvent = (command, blankEvent) => (state) => pipe(
  state,
  changedFields(command),
  (changed) => (
    isEmpty(changed)
      ? []
      : [{
        ...blankEvent,
        ...changed,
      }]
  ),
);
