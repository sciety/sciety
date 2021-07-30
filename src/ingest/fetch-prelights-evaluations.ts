import parser from 'fast-xml-parser';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import { JSDOM } from 'jsdom';
import { FetchData } from './fetch-data';
import { FetchEvaluations, SkippedItem } from './update-all';

const key = process.env.PRELIGHTS_FEED_KEY ?? '';

const prelightsFeedCodec = t.type({
  rss: t.type({
    channel: t.type({
      item: t.array(t.type({
        pubDate: tt.DateFromISOString,
        category: t.string,
        guid: t.string,
        preprints: t.type({
          preprint: t.union([t.type({
            preprinturl: t.string,
          }),
          t.array(t.type({
            preprinturl: t.string,
          }))]),
        }),
      })),
    }),
  }),
});

type Feed = t.TypeOf<typeof prelightsFeedCodec>;

const toDoi = (fetchData: FetchData) => (url: string): TE.TaskEither<SkippedItem, string> => pipe(
  fetchData<string>(url),
  TE.mapLeft((e) => ({ item: url, reason: e })),
  TE.chainEitherKW(flow(
    (doc) => new JSDOM(doc),
    (dom) => dom.window.document.querySelector('meta[name="DC.Identifier"]'),
    (meta) => meta?.getAttribute('content'),
    O.fromNullable,
    E.fromOption(() => ({ item: url, reason: 'No DC.Identifier found' })),
    E.filterOrElse(
      (doi) => doi.startsWith('10.1101/'),
      () => ({ item: url, reason: 'Not a biorxiv DOI' }),
    ),
  )),
);

type FeedItem = Feed['rss']['channel']['item'][0];

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

const extractPrelights = (fetchData: FetchData) => (items: ReadonlyArray<Prelight>) => pipe(
  items,
  RA.filter((item) => item.category.includes('highlight')),
  T.traverseArray((item) => pipe(
    item.preprintUrl,
    toDoi(fetchData),
    TE.map((articleDoi) => ({
      date: item.pubDate,
      articleDoi,
      evaluationLocator: `prelights:${item.guid.replace('&#038;', '&')}`,
    })),
  )),
  T.map(RA.rights),
);

type Ports = {
  fetchData: FetchData,
};

export const fetchPrelightsEvaluations = (): FetchEvaluations => (ports: Ports) => pipe(
  ports.fetchData<string>(`https://prelights.biologists.com/feed/sciety/?key=${key}&hours=120`),
  TE.map((responseBody) => parser.parse(responseBody) as JSON),
  TE.chainEitherK(flow(
    prelightsFeedCodec.decode,
    E.mapLeft((errors) => PR.failure(errors).join('\n')),
  )),
  TE.map(flow(
    (feed) => feed.rss.channel.item,
    RA.chain(toIndividualPrelights),
  )),
  TE.chainTaskK(extractPrelights(ports.fetchData)),
  TE.map((evaluations) => ({
    evaluations,
    skippedItems: O.none,
  })),
);
