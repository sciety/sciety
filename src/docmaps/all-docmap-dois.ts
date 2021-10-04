import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, isGroupEvaluatedArticleEvent } from '../domain-events';
import * as Doi from '../types/doi';
import * as GID from '../types/group-id';

const ncrcGroupId = GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a');

type AllDocmapDois = (events: ReadonlyArray<DomainEvent>) => ReadonlyArray<{
  articleId: Doi.Doi,
  groupId: GID.GroupId,
  updated: Date,
}>;

export const allDocmapDois: AllDocmapDois = (events) => pipe(
  events,
  RA.filter(isGroupEvaluatedArticleEvent),
  RA.filter(({ groupId }) => ncrcGroupId === groupId),
  RA.map(({ articleId, groupId, date }) => ({
    articleId,
    groupId,
    updated: date,
  })),
);
