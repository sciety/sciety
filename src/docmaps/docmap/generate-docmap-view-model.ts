import { URL } from 'url';
import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe } from 'fp-ts/function';
import { ArticleServer } from '../../types/article-server';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { Group } from '../../types/group';
import { GroupId } from '../../types/group-id';
import { ReviewId } from '../../types/review-id';

export type DocmapModel = {
  articleId: Doi,
  group: Group,
  inputPublishedDate: O.Option<Date>,
  evaluations: RNEA.ReadonlyNonEmptyArray<{
    sourceUrl: URL,
    reviewId: ReviewId,
    occurredAt: Date,
  }>,
};

export type DocmapIdentifier = {
  articleId: Doi,
  groupId: GroupId,
};

type GenerateDocmapViewModel = (
  ports: Ports
) => (
  docmapIdentifier: DocmapIdentifier
) => TE.TaskEither<DE.DataError, DocmapModel>;

// ts-unused-exports:disable-next-line
export type FindVersionsForArticleDoi = (
  doi: Doi,
  server: ArticleServer
) => TO.TaskOption<RNEA.ReadonlyNonEmptyArray<{
  source: URL,
  occurredAt: Date,
  version: number,
}>>;

type ReviewForArticle = {
  reviewId: ReviewId,
  groupId: GroupId,
  occurredAt: Date,
};

type FindReviewsForArticleDoi = (articleDoi: Doi) => TE.TaskEither<DE.DataError, ReadonlyArray<ReviewForArticle>>;

type GetGroup = (groupId: GroupId) => TO.TaskOption<Group>;

export type Ports = {
  fetchReview: (reviewId: ReviewId) => TE.TaskEither<DE.DataError, { url: URL }>,
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  getGroup: GetGroup,
  fetchArticle: (doi: Doi) => TE.TaskEither<DE.DataError, { server: ArticleServer }>,
};

const extendWithSourceUrl = (ports: Ports) => (review: ReviewForArticle) => pipe(
  review.reviewId,
  ports.fetchReview,
  TE.map((fetchedReview) => ({
    ...review,
    sourceUrl: fetchedReview.url,
  })),
);

export const generateDocmapViewModel: GenerateDocmapViewModel = (ports) => ({ articleId, groupId }) => pipe(
  {
    articleId: TE.right(articleId),
    evaluations: pipe(
      articleId,
      ports.findReviewsForArticleDoi,
      TE.map(RA.filter((ev) => ev.groupId === groupId)),
      TE.chainW(TE.traverseArray(extendWithSourceUrl(ports))),
      TE.chainEitherKW(flow(
        RNEA.fromReadonlyArray,
        E.fromOption(() => DE.notFound),
      )),
    ),
    inputPublishedDate: pipe(
      articleId,
      ports.fetchArticle,
      TE.chainW(({ server }) => pipe(
        ports.findVersionsForArticleDoi(articleId, server),
        TO.map(
          (versions) => pipe(
            versions,
            RNEA.last,
            (version) => version.occurredAt,
          ),
        ),
        TE.rightTask,
      )),
    ),
    group: pipe(
      groupId,
      ports.getGroup,
      TE.fromTaskOption(() => DE.notFound),
    ),
  },
  sequenceS(TE.ApplyPar),
);
