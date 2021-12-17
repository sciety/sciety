import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FetchData } from './fetch-data';
import { daysAgo } from './time';
import { FetchEvaluations } from './update-all';
import * as CR from '../third-parties/crossref';

type Ports = {
  fetchData: FetchData,
};

const identifyCandidates = (fetchData: FetchData) => (
  CR.fetchReviewsIndexedSince(fetchData)('10.1162', daysAgo(1))
);

const toEvaluationOrSkip = (candidate: CR.CrossrefReview) => pipe(
  candidate,
  E.right,
  E.map((review) => ({
    date: new Date(review.created['date-time']),
    articleDoi: review.relation['is-review-of'][0].id,
    evaluationLocator: `rapidreviews:${review.URL}`,
    authors: pipe(
      review.author,
      O.map(RA.map((author) => `${pipe(author.given, O.fold(() => '', (given) => `${given} `))}${author.family}`)),
      O.getOrElseW(() => []),
    ),
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
