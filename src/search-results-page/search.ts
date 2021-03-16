import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { ArticleViewModel } from './render-search-result';
import { Doi } from '../types/doi';
import { DomainEvent } from '../types/domain-events';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';
import { ReviewId } from '../types/review-id';

export type MatchedArticle = {
  doi: Doi,
  title: string,
  authors: string,
  postedDate: Date,
};

export type GetGroup = (editorialCommunityId: GroupId) => T.Task<O.Option<Group>>;
export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;
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
