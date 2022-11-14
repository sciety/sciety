import { DomainEvent } from '../../domain-events';
import { Doi } from '../../types/doi';
import { ListId } from '../../types/list-id';
import { ListOwnerId } from '../../types/list-owner-id';

type ListState = {
  ownerId: ListOwnerId,
  articleIds: ReadonlyArray<Doi>,
};
export type ReadModel = Record<ListId, ListState>;

export const initialState = (): ReadModel => ({});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => readmodel;
