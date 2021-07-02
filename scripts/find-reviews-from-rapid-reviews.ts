import axios from 'axios';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import { FetchEvaluations } from './update-all';

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
  RA.filter(({ articleDoi }) => articleDoi.startsWith('10.1101/')),
);

const getJson = (url: string): TE.TaskEither<Array<t.ValidationError>, JSON> => pipe(
  TE.tryCatch(async () => axios.get<JSON>(url, {
    headers: {
      'User-Agent': 'Sciety (http://sciety.org; mailto:team@sciety.org)',
    },
  }),
  (e) => { process.stderr.write(`${JSON.stringify(e)}\n`); return []; }),
  TE.map((response) => response.data),
);

const pageSize = 100;

const constructUrls = (numberOfEvaluations: number) => (
  Array.from(Array(Math.ceil(numberOfEvaluations / pageSize)).keys())
    .map((i) => `https://api.crossref.org/prefixes/10.1162/works?filter=type:peer-review&rows=${pageSize}&offset=${pageSize * i}`)
);

const generatePageUrls = pipe(
  'https://api.crossref.org/prefixes/10.1162/works?filter=type:peer-review&rows=1&offset=0',
  getJson,
  TE.chainEitherK(resultsTotal.decode),
  TE.map((obj) => obj.message['total-results']),
  TE.map(constructUrls),
);

export const fetchRapidReviews = (): FetchEvaluations => pipe(
  generatePageUrls,
  TE.chain(TE.traverseArray(flow(
    getJson,
    TE.chainEitherK(rapidReviewCodec.decode),
    TE.map(extractEvaluations),
  ))),
  TE.bimap(
    (errors) => PR.failure(errors).join('\n'),
    RA.flatten,
  ),
);
