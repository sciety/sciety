import { DomainEvent } from '../domain-events';
import { ListAggregate } from '../shared-write-models/list-aggregate';
import { Doi } from '../types/doi';
import { ListId } from '../types/list-id';

export type ExecuteCommand = (
  command: { listId: ListId, articleId: Doi }
) => (
  aggregate: ListAggregate,
) => ReadonlyArray<DomainEvent>;

export const executeCommand: ExecuteCommand = () => () => [];
