/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { DomainEvent } from '../../domain-events';
import { ArticleActivity } from '../../types/article-activity';
import { GroupId } from '../../types/group-id';
import { ListId } from '../../types/list-id';

type ArticleState = ArticleActivity & {
  evaluatingGroups: Set<GroupId>,
  lists: Set<ListId>,
};

export type ReadModel = Map<string, ArticleState>;

// ts-unused-exports:disable-next-line
export const initialState = (): ReadModel => new Map();

// ts-unused-exports:disable-next-line
export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => readmodel;
