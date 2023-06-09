import { DomainEvent } from '../../domain-events';

export type ReadModel = string;

export const initialState = (): ReadModel => '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => '';
