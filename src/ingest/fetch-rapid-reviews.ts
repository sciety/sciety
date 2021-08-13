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

const rapidReviewCodec = t.type({
  message: t.type({
    items: t.array(t.type({
      URL: t.string,
      created: t.type({
        'date-time': tt.DateFromISOString,
      }),
      relation: t.type({
        'is-review-of': t.array(t.type({
          id: t.string,
        })),
      }),
    })),
  }),
});

const extractEvaluations = (data: t.TypeOf<typeof rapidReviewCodec>) => pipe(
  data.message.items.map((item) => ({
    date: new Date(item.created['date-time']),
    articleDoi: item.relation['is-review-of'][0].id,
    evaluationLocator: `rapidreviews:${item.URL}`,
  })),
);

const pageSize = 100;

const constructUrls = (numberOfEvaluations: number) => (
  Array.from(Array(Math.ceil(numberOfEvaluations / pageSize)).keys())
    .map((i) => `https://api.crossref.org/prefixes/10.1162/works?filter=type:peer-review&rows=${pageSize}&offset=${pageSize * i}`)
);

const fetchAndDecode = <A>(fetchData: FetchData, codec: t.Decoder<unknown, A>) => (url: string) => pipe(
  fetchData<JSON>(url),
  TE.chainEitherK(flow(
    codec.decode,
    E.mapLeft((errors) => PR.failure(errors).join('\n')),
  )),
);

const generatePageUrls = (fetchData: FetchData) => pipe(
  'https://api.crossref.org/prefixes/10.1162/works?filter=type:peer-review&rows=1&offset=0',
  fetchAndDecode(fetchData, resultsTotal),
  TE.map((obj) => obj.message['total-results']),
  TE.map(constructUrls),
);

export const fetchRapidReviews = (): FetchEvaluations => (ports: Ports) => pipe(
  generatePageUrls(ports.fetchData),
  TE.chain(TE.traverseArray(flow(
    fetchAndDecode(ports.fetchData, rapidReviewCodec),
    TE.map(extractEvaluations),
  ))),
  TE.map(RA.flatten),
  TE.map(RA.partitionMap((item) => pipe(
    item,
    E.right,
    E.filterOrElse(
      (review) => review.articleDoi.startsWith('10.1101/'),
      (review) => ({ item: review.articleDoi, reason: 'Not a biorxiv article' }),
    ),
  ))),
  TE.map((parts) => ({
    evaluations: parts.right,
    skippedItems: parts.left,
  })),
);
