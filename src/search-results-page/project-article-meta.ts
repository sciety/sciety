import * as T from 'fp-ts/Task';
import { flow } from 'fp-ts/function';
import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';
import { ReviewId } from '../types/review-id';

export type FindReviewsForArticleDoi = (articleDoi: Doi) => T.Task<ReadonlyArray<{
  reviewId: ReviewId,
  editorialCommunityId: GroupId,
}>>;

type ProjectArticleMeta = (findReviewsForArticleDoi: FindReviewsForArticleDoi) => (articleDoi: Doi) => T.Task<number>;

export const projectArticleMeta: ProjectArticleMeta = (findReviewsForArticleDoi) => flow(
  findReviewsForArticleDoi,
  T.map((list) => list.length),
);
