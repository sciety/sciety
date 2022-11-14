import { DomainEvent } from '../../domain-events';
import { Doi } from '../../types/doi';
import { UserId } from '../../types/user-id';

export type ReadModel = Record<UserId, ReadonlyArray<Doi>>;

export const initialState = (): ReadModel => ({});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => readmodel;
