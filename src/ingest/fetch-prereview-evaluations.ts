import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import { FetchData } from './fetch-data';
import { Evaluation } from './types/evaluations';
import { FetchEvaluations } from './update-all';
import { DoiFromString } from '../types/codecs/DoiFromString';

type Ports = {
  fetchData: FetchData,
};

const preReviewReview = t.type({
  createdAt: tt.DateFromISOString,
  doi: DoiFromString,
  preprint: DoiFromString,
  authors: t.readonlyArray(t.type({
    name: t.string,
  })),
});

const preReviewResponse = t.readonlyArray(preReviewReview);

type PreReviewReview = t.TypeOf<typeof preReviewReview>;

const toEvaluation = (review: PreReviewReview) => ({
  date: review.createdAt,
  articleDoi: review.preprint.value,
  evaluationLocator: `doi:${review.doi.value}`,
  authors: pipe(
    review.authors,
    RA.map(author => author.name),
  ),
} satisfies Evaluation);

const identifyCandidates = (fetchData: FetchData) => pipe(
  fetchData<unknown>('http://host.docker.internal:3000/sciety-list', { Accept: 'application/json', Authorization: 'Bearer secret' }),
  TE.chainEitherK(flow(
    preReviewResponse.decode,
    E.mapLeft((errors) => PR.failure(errors).join('\n')),
  )),
);

export const fetchPrereviewEvaluations = (): FetchEvaluations => (ports: Ports) => pipe(
  identifyCandidates(ports.fetchData),
  TE.map(RA.map(toEvaluation)),
  TE.map((parts) => ({
    evaluations: parts,
    skippedItems: [],
  })),
);
