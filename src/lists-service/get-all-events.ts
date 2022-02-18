import { DomainEvent } from '../domain-events';

type GetAllEvents = () => ReadonlyArray<DomainEvent>;

export const getAllEvents: GetAllEvents = () => [];
