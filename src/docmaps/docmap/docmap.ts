import { URL } from 'url';
import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe } from 'fp-ts/function';
import { context } from './context';
import { ArticleServer } from '../../types/article-server';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { Group } from '../../types/group';
import { GroupId } from '../../types/group-id';
import { ReviewId } from '../../types/review-id';

// ts-unused-exports:disable-next-line
export type FindVersionsForArticleDoi = (
  doi: Doi,
  server: ArticleServer
) => TO.TaskOption<RNEA.ReadonlyNonEmptyArray<{
  source: URL,
  occurredAt: Date,
  version: number,
}>>;

type FindReviewsForArticleDoi = (articleDoi: Doi) => TE.TaskEither<DE.DataError, ReadonlyArray<{
  reviewId: ReviewId,
  groupId: GroupId,
  occurredAt: Date,
}>>;
type GetGroup = (groupId: GroupId) => TO.TaskOption<Group>;

export type Ports = {
  fetchReview: (reviewId: ReviewId) => TE.TaskEither<DE.DataError, { url: URL }>,
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  getGroup: GetGroup,
  fetchArticle: (doi: Doi) => TE.TaskEither<DE.DataError, { server: ArticleServer }>,
};

type Action = {
  participants: ReadonlyArray<unknown>,
  outputs: ReadonlyArray<unknown>,
};

type Step = {
  assertions: [],
  inputs: ReadonlyArray<unknown>,
  actions: ReadonlyArray<Action>,
};

export type Docmap = {
  '@context': Record<string, unknown>,
  id: string,
  type: 'docmap',
  created: string,
  updated: string,
  publisher: Record<string, unknown>,
  'first-step': '_:b0',
  steps: Record<string, Step>,
};

const createReviewArticleOutput = (
  evaluation: {
    occurredAt: Date,
    reviewId: string,
  },
  sourceUrl: URL,
  articleId: Doi,
) => ({
  type: 'review-article',
  published: evaluation.occurredAt,
  content: [
    {
      type: 'web-page',
      url: sourceUrl.toString(),
    },
    {
      type: 'web-page',
      url: `https://sciety.org/articles/activity/${articleId.value}#${evaluation.reviewId}`,
    },
  ],
});

type CreateDocmap = (
  ports: Ports,
  indexedGroupId: GroupId,
) => (
  articleId: Doi,
) => TE.TaskEither<DE.DataError, Docmap>;

export const docmap: CreateDocmap = (ports, indexedGroupId) => (articleId) => pipe(
  {
    evaluations: pipe(
      articleId,
      ports.findReviewsForArticleDoi,
      TE.chainEitherKW((reviews) => pipe(
        {
          firstEvaluation: pipe(reviews, RA.findFirst((ev) => ev.groupId === indexedGroupId)),
          lastEvaluation: pipe(reviews, RA.findLast((ev) => ev.groupId === indexedGroupId)),
        },
        sequenceS(O.Apply),
        E.fromOption(() => DE.notFound),
      )),
    ),
    articleVersions: pipe(
      articleId,
      ports.fetchArticle,
      TE.chainW(({ server }) => pipe(
        ports.findVersionsForArticleDoi(articleId, server),
        TE.fromTaskOption(() => DE.unavailable),
      )),
    ),
    indexedGroup: pipe(
      indexedGroupId,
      ports.getGroup,
      TE.fromTaskOption(() => DE.notFound),
    ),
  },
  (domain) => ({
    ...domain,
    sourceUrl: pipe(
      domain.evaluations,
      TE.chain(flow(
        ({ firstEvaluation }) => ports.fetchReview(firstEvaluation.reviewId),
        TE.map(({ url }) => url),
      )),
    ),
  }),
  sequenceS(TE.ApplyPar),
  TE.map(({
    indexedGroup, articleVersions, evaluations, sourceUrl,
  }) => ({
    '@context': context,
    id: `https://sciety.org/docmaps/v1/articles/${articleId.value}.docmap.json`,
    type: 'docmap',
    created: evaluations.firstEvaluation.occurredAt.toISOString(),
    updated: evaluations.lastEvaluation.occurredAt.toISOString(),
    publisher: {
      id: indexedGroup.homepage,
      name: indexedGroup.name,
      logo: `https://sciety.org${indexedGroup.avatarPath}`,
      homepage: indexedGroup.homepage,
      account: {
        id: `https://sciety.org/groups/${indexedGroup.id}`,
        service: 'https://sciety.org',
      },
    },
    'first-step': '_:b0',
    steps: {
      '_:b0': {
        assertions: [],
        inputs: [{
          doi: articleId.value,
          url: `https://doi.org/${articleId.value}`,
          published: articleVersions[articleVersions.length - 1].occurredAt,
        }],
        actions: [
          {
            participants: [
              { actor: { name: 'anonymous', type: 'person' }, role: 'peer-reviewer' },
            ],
            outputs: [
              createReviewArticleOutput(evaluations.firstEvaluation, sourceUrl, articleId),
            ],
          },
        ],
      },
    },
  })),
);
