import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ArticleViewModel, GroupViewModel } from './render-search-result';
import { Doi } from '../types/doi';
import { DomainEvent } from '../types/domain-events';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';
import { toHtmlFragment } from '../types/html-fragment';
import { ReviewId } from '../types/review-id';
import { sanitise } from '../types/sanitised-html-fragment';

export type MatchedArticle = {
  doi: Doi,
  title: string,
  authors: string,
  postedDate: Date,
};

export type GetGroup = (editorialCommunityId: GroupId) => T.Task<O.Option<Group>>;
export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;
type ProjectGroupMeta = (groupId: GroupId) => T.Task<{
  reviewCount: number,
  followerCount: number,
}>;

export const constructGroupResult = (getGroup: GetGroup, projectGroupMeta: ProjectGroupMeta) => (groupId: GroupId): TE.TaskEither<'not-found', GroupViewModel> => pipe(
  groupId,
  getGroup,
  T.map(E.fromOption(() => 'not-found' as const)),
  TE.chainW((group) => pipe(
    group.id,
    projectGroupMeta,
    T.map((meta) => ({
      ...group,
      ...meta,
      _tag: 'Group' as const,
      description: sanitise(toHtmlFragment(group.shortDescription)),
    })),
    TE.rightTask,
  )),
);

export type FindReviewsForArticleDoi = (articleDoi: Doi) => T.Task<ReadonlyArray<{
  reviewId: ReviewId,
  editorialCommunityId: GroupId,
}>>;

export const toArticleViewModel = (
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
) => (matchedArticle: MatchedArticle): T.Task<ArticleViewModel> => pipe(
  matchedArticle.doi,
  findReviewsForArticleDoi,
  T.map((reviews) => ({
    _tag: 'Article' as const,
    ...matchedArticle,
    reviewCount: reviews.length,
  })),
);
