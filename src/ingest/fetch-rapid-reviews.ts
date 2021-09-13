import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as CR from './crossref';
import { FetchData } from './fetch-data';
import { FetchEvaluations } from './update-all';

type Ports = {
  fetchData: FetchData,
};

const identifyCandidates = (fetchData: FetchData) => (
  CR.fetchAllReviewsBy(fetchData)('10.1162')
);

const toEvaluationOrSkip = (candidate: CR.CrossrefReview) => pipe(
  candidate,
  E.right,
  E.map((review) => ({
    date: new Date(review.created['date-time']),
    articleDoi: review.relation['is-review-of'][0].id,
    evaluationLocator: `rapidreviews:${review.URL}`,
  })),
  E.filterOrElse(
    (review) => review.articleDoi.startsWith('10.1101/'),
    (review) => ({ item: review.articleDoi, reason: 'Not a biorxiv article' }),
  ),
);

export const fetchRapidReviews = (): FetchEvaluations => (ports: Ports) => pipe(
  identifyCandidates(ports.fetchData),
  TE.map(RA.map(toEvaluationOrSkip)),
  TE.map((parts) => ({
    evaluations: RA.rights(parts),
    skippedItems: RA.lefts(parts),
  })),
);
