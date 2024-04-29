import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as PR from 'io-ts/PathReporter';
import * as tt from 'io-ts-types';
import * as AID from '../../types/article-id';
import { FetchData } from '../fetch-data';
import { constructPublishedEvaluation } from '../types/published-evaluation';
import { DiscoverPublishedEvaluations } from '../update-all';

type Ports = {
  fetchData: FetchData,
};

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

const preReviewResponse = t.type({
  data: t.readonlyArray(preReviewPreprint),
});

type PreReviewPreprint = t.TypeOf<typeof preReviewPreprint>;

type Review = {
  date: Date,
  handle: string | AID.ArticleId,
  reviewDoi: O.Option<AID.ArticleId>,
  isPublished: boolean,
  authors: ReadonlyArray<string>,
};

const toEvaluationOrSkip = (preprint: Review) => pipe(
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

const identifyCandidates = (fetchData: FetchData) => pipe(
  fetchData<unknown>('https://www.prereview.org/api/v2/preprints', { Accept: 'application/json' }),
  TE.chainEitherK(flow(
    preReviewResponse.decode,
    E.mapLeft((errors) => PR.failure(errors).join('\n')),
  )),
  TE.map(flow(
    ({ data }) => data,
    RA.chain(toIndividualReviews),
  )),
);

export const discoverPrereviewEvaluations = (): DiscoverPublishedEvaluations => (ports: Ports) => pipe(
  identifyCandidates(ports.fetchData),
  TE.map(RA.map(toEvaluationOrSkip)),
  TE.map((parts) => ({
    understood: RA.rights(parts),
    skipped: RA.lefts(parts),
  })),
);
