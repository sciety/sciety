import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { decodeAndReportFailures } from './decode-and-report-failures';
import { DiscoverPublishedEvaluations } from '../discover-published-evaluations';
import { FetchData } from '../fetch-data';
import { PublishedEvaluation } from '../types/published-evaluation';

const preReviewReviewCodec = t.type({
  createdAt: tt.DateFromISOString,
  doi: tt.NonEmptyString,
  preprint: tt.NonEmptyString,
  authors: t.readonlyArray(t.type({
    name: tt.NonEmptyString,
  })),
});

type PreReviewReview = t.TypeOf<typeof preReviewReviewCodec>;

const preReviewResponseCodec = t.readonlyArray(preReviewReviewCodec, 'preReviewResponseCodec');

const toEvaluationOrSkip = (item: PreReviewReview) => E.right({
  publishedOn: item.createdAt,
  paperExpressionDoi: item.preprint.replace(/^doi:/, ''),
  evaluationLocator: `doi:${item.doi}`,
  authors: pipe(
    item.authors,
    RA.map((author) => author.name),
  ),
} satisfies PublishedEvaluation);

const identifyCandidates = (fetchData: FetchData, bearerToken: string) => pipe(
  fetchData<unknown>('https://prereview.org/sciety-list', { Accept: 'application/json', Authorization: `Bearer ${bearerToken}` }),
  TE.chainEitherK(decodeAndReportFailures(preReviewResponseCodec)),
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
