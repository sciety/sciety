import parser from 'fast-xml-parser';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import { extractPrelights } from './extract-prelights';
import { FetchData } from '../fetch-data';
import { FetchEvaluations } from '../update-all';

const key = process.env.PRELIGHTS_FEED_KEY ?? '';

const itemCodec = t.type({
  pubDate: tt.DateFromISOString,
  category: t.string,
  guid: t.string,
  preprints: t.type({
    preprint: t.union([
      t.type({ preprinturl: t.string }),
      t.array(t.type({ preprinturl: t.string })),
    ]),
  }),
});

const prelightsFeedCodec = t.type({
  rss: t.type({
    channel: t.type({
      item: t.array(itemCodec),
    }),
  }),
});

type FeedItem = t.TypeOf<typeof itemCodec>;

type Prelight = {
  guid: string,
  category: string,
  pubDate: Date,
  preprintUrl: string,
};

const toIndividualPrelights = (item: FeedItem): Array<Prelight> => {
  if (item.preprints.preprint instanceof Array) {
    return item.preprints.preprint.map((preprintItem) => ({
      ...item,
      preprintUrl: preprintItem.preprinturl,
    }));
  }
  return [{
    ...item,
    preprintUrl: item.preprints.preprint.preprinturl,
  }];
};

type Ports = {
  fetchData: FetchData,
};

export const fetchPrelightsEvaluations = (): FetchEvaluations => (ports: Ports) => pipe(
  ports.fetchData<string>(`https://prelights.biologists.com/feed/sciety/?key=${key}&hours=120`),
  TE.map((responseBody) => parser.parse(responseBody, { arrayMode: /item/ }) as JSON),
  TE.chainEitherK(flow(
    prelightsFeedCodec.decode,
    E.mapLeft((errors) => PR.failure(errors).join('\n')),
  )),
  TE.map(flow(
    (feed) => feed.rss.channel.item,
    RA.chain(toIndividualPrelights),
  )),
  TE.chainTaskK(extractPrelights(ports.fetchData)),
);
