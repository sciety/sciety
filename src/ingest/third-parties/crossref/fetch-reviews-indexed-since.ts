import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { decodeAndReportFailures } from '../../decode-and-report-failures';
import { FetchData } from '../../fetch-data';

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
  author: tt.optionFromNullable(t.readonlyArray(t.type({
    given: tt.optionFromNullable(t.string),
    family: t.string,
  }))),
  resource: t.type({
    primary: t.type({
      URL: t.string,
    }),
  }),
});

export type CrossrefReview = t.TypeOf<typeof crossrefReviewFromJson>;

const crossrefReviewsFromJsonCodec = t.type({
  message: t.type({
    items: t.array(crossrefReviewFromJson),
  }),
}, 'crossrefReviewsFromJsonCodec');

type FetchReviewsIndexedSince = (f: FetchData)
=> (r: string, since: Date)
=> TE.TaskEither<string, ReadonlyArray<CrossrefReview>>;

export const fetchReviewsIndexedSince: FetchReviewsIndexedSince = (fetchData) => (prefix, since) => pipe(
  `https://api.crossref.org/prefixes/${prefix}/works?filter=type:peer-review,from-index-date:${since.toISOString().split('T')[0]}&rows=1000`,
  (url) => fetchData<JSON>(url),
  TE.chainEitherK(decodeAndReportFailures(crossrefReviewsFromJsonCodec)),
  TE.map((data) => data.message.items),
);
