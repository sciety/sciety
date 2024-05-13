import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FetchData } from '../fetch-data';
import * as CR from '../third-parties/crossref';
import { deprecatedIngestionWindowStartDate } from '../time';
import { constructPublishedEvaluation } from '../types/published-evaluation';
import { DiscoverPublishedEvaluations } from '../update-all';

type Ports = {
  fetchData: FetchData,
};

const identifyCandidates = (fetchData: FetchData) => (
  CR.fetchReviewsIndexedSince(fetchData)('10.1162', deprecatedIngestionWindowStartDate(1))
);

const toEvaluationOrSkip = (candidate: CR.CrossrefReview) => pipe(
  candidate,
  E.right,
  E.filterOrElse(
    (review) => review.resource.primary.URL.includes('rrid.'),
    (review) => ({ item: review.URL, reason: 'Not a rrid evaluation' }),
  ),
  E.map((review) => constructPublishedEvaluation({
    publishedOn: new Date(review.created['date-time']),
    paperExpressionDoi: review.relation['is-review-of'][0].id,
    evaluationLocator: `rapidreviews:${review.URL}`,
    authors: pipe(
      review.author,
      O.map(RA.map((author) => `${pipe(author.given, O.match(() => '', (given) => `${given} `))}${author.family}`)),
      O.getOrElseW(() => []),
    ),
  })),
);

export const discoverRapidReviewsEvaluations = (): DiscoverPublishedEvaluations => () => (ports: Ports) => pipe(
  identifyCandidates(ports.fetchData),
  TE.map(RA.map(toEvaluationOrSkip)),
  TE.map((parts) => ({
    understood: RA.rights(parts),
    skipped: RA.lefts(parts),
  })),
);
