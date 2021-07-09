import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import { FetchData } from './fetch-data';
import { FetchEvaluations } from './update-all';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { Doi, isDoi } from '../types/doi';
import { ReviewId } from '../types/review-id';

type Ports = {
  fetchData: FetchData,
};

const preReviewPreprint = t.type({
  handle: t.union([DoiFromString, t.string]),
  fullReviews: t.readonlyArray(t.type({
    createdAt: tt.DateFromISOString,
    doi: tt.optionFromNullable(DoiFromString),
  })),
});

const preReviewResponse = t.type({
  data: t.readonlyArray(preReviewPreprint),
});

type PreReviewPreprint = t.TypeOf<typeof preReviewPreprint>;

type Preprint = {
  handle: Doi,
  fullReviews: ReadonlyArray<{
    createdAt: Date,
    doi: Doi,
  }>,
};

const biorxivPrefix = '10.1101';

const toPreprint = flow(
  (preprint: PreReviewPreprint) => O.some(preprint),
  O.filter((preprint): preprint is PreReviewPreprint & { handle: Doi } => isDoi(preprint.handle)),
  O.filter((preprint) => preprint.handle.hasPrefix(biorxivPrefix)),
  O.map((preprint): Preprint => pipe(
    preprint.fullReviews,
    RA.map((review) => ({ createdAt: O.some(review.createdAt), doi: review.doi })),
    RA.map(sequenceS(O.Apply)),
    RA.compact,
    (fullReviews) => ({ handle: preprint.handle, fullReviews }),
  )),
);

const toReviews = (preprint: Preprint) => pipe(
  preprint.fullReviews,
  RA.map(({ doi, createdAt }) => ({
    date: createdAt,
    articleDoi: preprint.handle.value,
    evaluationLocator: `doi:${doi.value}` as unknown as ReviewId,
  })),
);

export const fetchPrereviewEvaluations = (): FetchEvaluations => (ports: Ports) => pipe(
  ports.fetchData<unknown>('https://www.prereview.org/api/v2/preprints', { Accept: 'application/json' }),
  TE.chainEitherK(flow(
    preReviewResponse.decode,
    E.mapLeft((errors) => PR.failure(errors).join('\n')),
  )),
  TE.map(flow(
    ({ data }) => data,
    RA.map(toPreprint),
    RA.compact,
    RA.chain(toReviews),
  )),
);
