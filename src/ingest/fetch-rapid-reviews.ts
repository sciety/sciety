import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import { FetchData } from './fetch-data';
import { FetchEvaluations } from './update-all';

type Ports = {
  fetchData: FetchData,
};

const resultsTotal = t.type({
  message: t.type({
    'total-results': t.number,
  }),
});

const crossrefReviewFromJson = t.type({
  URL: t.string,
  created: t.type({
    'date-time': tt.DateFromISOString,
  }),
  relation: t.type({
    'is-review-of': t.array(t.type({
      id: t.string,
    })),
  }),
});

type CrossrefReview = t.TypeOf<typeof crossrefReviewFromJson>;

const crossrefReviewsFromJson = t.type({
  message: t.type({
    items: t.array(crossrefReviewFromJson),
  }),
});

const pageSize = 100;

const constructUrls = (reviewerId: string) => (numberOfEvaluations: number) => (
  Array.from(Array(Math.ceil(numberOfEvaluations / pageSize)).keys())
    .map((i) => `https://api.crossref.org/prefixes/${reviewerId}/works?filter=type:peer-review&rows=${pageSize}&offset=${pageSize * i}`)
);

const fetchAndDecode = <A>(fetchData: FetchData, codec: t.Decoder<unknown, A>) => (url: string) => pipe(
  fetchData<JSON>(url),
  TE.chainEitherK(flow(
    codec.decode,
    E.mapLeft((errors) => PR.failure(errors).join('\n')),
  )),
);

const generatePageUrls = (fetchData: FetchData) => (reviewerId: string) => pipe(
  `https://api.crossref.org/prefixes/${reviewerId}/works?filter=type:peer-review&rows=1&offset=0`,
  fetchAndDecode(fetchData, resultsTotal),
  TE.map((obj) => obj.message['total-results']),
  TE.map(constructUrls(reviewerId)),
);

const identifyCandidates = (fetchData: FetchData) => pipe(
  generatePageUrls(fetchData)('10.1162'),
  TE.chain(TE.traverseArray(flow(
    fetchAndDecode(fetchData, crossrefReviewsFromJson),
    TE.map((data) => data.message.items),
  ))),
  TE.map(RA.flatten),
);

const toEvaluationOrSkip = (candidate: CrossrefReview) => pipe(
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
