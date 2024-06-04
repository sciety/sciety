import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as PR from 'io-ts/PathReporter';
import * as tt from 'io-ts-types';
import * as AID from '../../types/article-id';
import { DiscoverPublishedEvaluations } from '../discover-published-evaluations';
import { FetchData } from '../fetch-data';
import { PublishedEvaluation, constructPublishedEvaluation } from '../types/published-evaluation';
import { SkippedEvaluation } from '../types/skipped-evaluation';

const preReviewPreprint = t.type({
  handle: t.union([AID.articleIdCodec, t.string]),
  fullReviews: t.readonlyArray(t.type({
    createdAt: tt.DateFromISOString,
    doi: tt.optionFromNullable(AID.articleIdCodec),
    isPublished: t.boolean,
    authors: t.readonlyArray(t.type({
      name: t.string,
    })),
  })),
});

const deprecatedPreReviewResponse = t.type({
  data: t.readonlyArray(preReviewPreprint),
});

const preReviewReview = t.type({
  createdAt: tt.DateFromISOString,
  doi: AID.articleIdCodec,
  preprint: t.union([AID.articleIdCodec, t.string]),
  authors: t.readonlyArray(t.type({
    name: t.string,
  })),
});

type PreReviewReview = t.TypeOf<typeof preReviewReview>;

const preReviewResponse = t.readonlyArray(preReviewReview);

type PreReviewPreprint = t.TypeOf<typeof preReviewPreprint>;

type Review = {
  date: Date,
  handle: string | AID.ArticleId,
  reviewDoi: O.Option<AID.ArticleId>,
  isPublished: boolean,
  authors: ReadonlyArray<string>,
};

const deprecatedToEvaluationOrSkip = (preprint: Review) => pipe(
  preprint,
  E.right,
  E.filterOrElse(
    (p): p is Review & { handle: AID.ArticleId } => AID.isArticleId(p.handle),
    () => ({ item: preprint.handle as string, reason: 'article has no DOI' }),
  ),
  E.filterOrElse(
    (p): p is Review & { handle: AID.ArticleId, reviewDoi: O.Some<AID.ArticleId> } => O.isSome(p.reviewDoi),
    () => ({ item: `${AID.toString(preprint.handle as AID.ArticleId)} / ${preprint.date.toISOString()}`, reason: 'review has no DOI' }),
  ),
  E.filterOrElse(
    (p) => p.isPublished,
    () => ({ item: AID.toString(preprint.handle as AID.ArticleId), reason: 'is not published' }),
  ),
  E.map((p) => constructPublishedEvaluation({
    publishedOn: p.date,
    paperExpressionDoi: p.handle.value,
    evaluationLocator: `doi:${p.reviewDoi.value.value}`,
    authors: p.authors,
  })),
);
const toEvaluationOrSkip = (item: PreReviewReview) => pipe(
  AID.isArticleId(item.preprint)
    ? E.right({
      publishedOn: item.createdAt,
      paperExpressionDoi: item.preprint.value,
      evaluationLocator: `doi:${item.doi.value}`,
      authors: pipe(
        item.authors,
        RA.map((author) => author.name),
      ),
    } satisfies PublishedEvaluation)
    : E.left({
      item: item.doi.value,
      reason: 'evaluated preprint does not have a DOI',
    } satisfies SkippedEvaluation),
);

const toIndividualReviews = (preprint: PreReviewPreprint): ReadonlyArray<Review> => pipe(
  preprint.fullReviews,
  RA.map((review) => ({
    date: review.createdAt,
    handle: preprint.handle,
    reviewDoi: review.doi,
    isPublished: review.isPublished,
    authors: pipe(
      review.authors,
      RA.map((author) => author.name),
    ),
  })),
);

const deprecatedIdentifyCandidates = (fetchData: FetchData) => pipe(
  fetchData<unknown>('https://www.prereview.org/api/v2/preprints', { Accept: 'application/json' }),
  TE.chainEitherK(flow(
    deprecatedPreReviewResponse.decode,
    E.mapLeft((errors) => PR.failure(errors).join('\n')),
  )),
  TE.map(flow(
    ({ data }) => data,
    RA.chain(toIndividualReviews),
  )),
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const identifyCandidates = (fetchData: FetchData, bearerToken: string) => pipe(
  fetchData<unknown>('https://www.prereview.org/api/v2/preprints', { Accept: 'application/json' }),
  TE.chainEitherK(flow(
    preReviewResponse.decode,
    E.mapLeft((errors) => PR.failure(errors).join('\n')),
  )),
);

export const discoverPrereviewEvaluationsFromDeprecatedApi = (): DiscoverPublishedEvaluations => (
) => (dependencies) => pipe(
  deprecatedIdentifyCandidates(dependencies.fetchData),
  TE.map(RA.map(deprecatedToEvaluationOrSkip)),
  TE.map((parts) => ({
    understood: RA.rights(parts),
    skipped: RA.lefts(parts),
  })),
);

export const discoverPrereviewEvaluations = (bearerToken: string): DiscoverPublishedEvaluations => (
) => (dependencies) => pipe(
  identifyCandidates(dependencies.fetchData, bearerToken),
  TE.map(RA.map(toEvaluationOrSkip)),
  TE.map((parts) => ({
    understood: RA.rights(parts),
    skipped: RA.lefts(parts),
  })),
);
