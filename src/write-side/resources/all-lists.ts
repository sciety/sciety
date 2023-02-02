import { DomainEvent } from '../../domain-events';
import { ListId } from '../../types/list-id';

export type AllListsResource = ReadonlyArray<ListId>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const replayAllLists = (events: ReadonlyArray<DomainEvent>): AllListsResource => [];
