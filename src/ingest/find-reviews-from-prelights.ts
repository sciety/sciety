import parser from 'fast-xml-parser';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import { JSDOM } from 'jsdom';
import { fetchData } from './fetch-data';

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

const toDoi = (url: string): TE.TaskEither<string, string> => pipe(
  fetchData<string>(url),
  TE.chainEitherKW(flow(
    (doc) => new JSDOM(doc),
    (dom) => dom.window.document.querySelector('meta[name="DC.Identifier"]'),
    (meta) => meta?.getAttribute('content'),
    O.fromNullable,
    E.fromOption(() => {
      const msg = `WARNING: Cannot find DC.identifier at url: ${url}\n`;
      process.stderr.write(msg);
      return msg;
    }),
  )),
);

type Prelight = {
  guid: string,
  pubDate: Date,
  preprintUrl: string,
};

const extractPrelights = (feed: Feed) => pipe(
  feed.rss.channel.item,
  RA.filter((item) => item.category.includes('highlight')),
  RA.chain((item): Array<Prelight> => {
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
  }),
  T.traverseArray((item) => pipe(
    toDoi(item.preprintUrl),
    TE.map((articleDoi) => ({
      date: item.pubDate.toISOString(),
      articleDoi,
      evaluationLocator: `prelights:${item.guid.replace('&#038;', '&')}`,
    })),
  )),
  T.map(RA.rights),
);

void (async (): Promise<void> => {
  await pipe(
    fetchData<string>(`https://prelights.biologists.com/feed/sciety/?key=${key}&hours=120`),
    TE.map((responseBody) => parser.parse(responseBody) as JSON),
    TE.chainEitherK(flow(
      prelightsFeedCodec.decode,
      E.mapLeft((errors) => PR.failure(errors).join('\n')),
    )),
    TE.chainTaskK(extractPrelights),
    TE.bimap(
      (errors) => {
        process.stderr.write(errors);
      },
      (evaluations) => {
        process.stdout.write('Date,Article DOI,Review ID\n');
        pipe(
          evaluations,
          RA.map(({ date, articleDoi, evaluationLocator }) => process.stdout.write(`${date},${articleDoi},${evaluationLocator}\n`)),
        );
      },
    ),
    TE.fold(constant(T.of(1)), constant(T.of(0))),
    T.map((exitStatus) => process.exit(exitStatus)),
  )();
})();
