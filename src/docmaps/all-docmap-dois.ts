import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, isGroupEvaluatedArticleEvent } from '../domain-events';
import * as Doi from '../types/doi';
import { GroupId } from '../types/group-id';

type AllDocmapDois = (groupId: GroupId) => (events: ReadonlyArray<DomainEvent>) => ReadonlyArray<Doi.Doi>;

export const allDocmapDois: AllDocmapDois = (filterGroupId) => (events) => pipe(
  events,
  RA.filter(isGroupEvaluatedArticleEvent),
  RA.filter(({ groupId }) => filterGroupId === groupId),
  RA.map(({ articleId }) => articleId),
);
