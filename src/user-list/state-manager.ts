import { DomainEvent } from '../types/domain-events';

type StateManager = (events: ReadonlyArray<DomainEvent>) => boolean;

// ts-unused-exports:disable-next-line
export const stateManager: StateManager = () => false;
