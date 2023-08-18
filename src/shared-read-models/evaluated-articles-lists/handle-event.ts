/* eslint-disable no-param-reassign */
import { DomainEvent } from '../../domain-events';
import { GroupId } from '../../types/group-id';
import { ListId } from '../../types/list-id';

type ArticleState = {
  listedIn: ReadonlyArray<ListId>,
  evaluatedBy: ReadonlyArray<GroupId>,
};

export type ReadModel = {
  articles: Map<string, ArticleState>,
  groups: Map<GroupId, ListId>,
};

export const initialState = (): ReadModel => ({
  articles: new Map(),
  groups: new Map(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => readmodel;
