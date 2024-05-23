/* eslint-disable no-param-reassign */
import { DomainEvent } from '../../domain-events';
import { UserId } from '../../types/user-id';

export type ReadModel = Record<UserId, string>;

export const initialState = (): ReadModel => ({});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => readmodel;
