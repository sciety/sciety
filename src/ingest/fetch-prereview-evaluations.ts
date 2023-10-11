import * as E from 'fp-ts/Either';
import { flow, pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import * as AID from '../types/article-id';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { FetchData } from './fetch-data';
import { Evaluation } from './types/evaluations';
import { SkippedItem } from './types/skipped-item';
import { FetchEvaluations } from './update-all';

type Ports = {
  fetchData: FetchData,
};

const preReviewReview = t.type({
  createdAt: tt.DateFromISOString,
  doi: DoiFromString,
  preprint: t.union([DoiFromString, t.string]),
  authors: t.readonlyArray(t.type({
    name: t.string,
  })),
});

const preReviewResponse = t.readonlyArray(preReviewReview);

type PreReviewReview = t.TypeOf<typeof preReviewReview>;

const toEvaluationOrSkip = (
  reviews: ReadonlyArray<PreReviewReview>,
): ReadonlyArray<E.Either<SkippedItem, Evaluation>> => pipe(
  reviews,
  RA.map((review) => (AID.isArticleId(review.preprint)
    ? E.right({
      date: review.createdAt,
      articleDoi: review.preprint.value,
      evaluationLocator: `doi:${review.doi.value}`,
      authors: pipe(
        review.authors,
        RA.map((author) => author.name),
      ),
    } satisfies Evaluation)
    : E.left({ item: review.preprint as string, reason: 'article has no DOI' } satisfies SkippedItem))),
);

const identifyCandidates = (fetchData: FetchData) => pipe(
  fetchData<unknown>('http://host.docker.internal:3000/sciety-list', { Accept: 'application/json', Authorization: 'Bearer secret' }),
  TE.chainEitherK(flow(
    preReviewResponse.decode,
    E.mapLeft((errors) => PR.failure(errors).join('\n')),
  )),
);

export const fetchPrereviewEvaluations = (): FetchEvaluations => (ports: Ports) => pipe(
  identifyCandidates(ports.fetchData),
  TE.map(toEvaluationOrSkip),
  TE.map((parts) => ({
    evaluations: RA.rights(parts),
    skippedItems: RA.lefts(parts),
  })),
);
