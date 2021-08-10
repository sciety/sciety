import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, isEditorialCommunityReviewedArticleEvent } from '../domain-events';
import * as Doi from '../types/doi';
import { GroupId } from '../types/group-id';

type AllDocmapDois = (groupId: GroupId) => (events: ReadonlyArray<DomainEvent>) => ReadonlyArray<Doi.Doi>;

export const allDocmapDois: AllDocmapDois = (groupId) => (events) => pipe(
  events,
  RA.filter(isEditorialCommunityReviewedArticleEvent),
  RA.filter(({ editorialCommunityId }) => editorialCommunityId === groupId),
  RA.map(({ articleId }) => articleId),
);
