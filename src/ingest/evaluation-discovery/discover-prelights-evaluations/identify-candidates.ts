import { XMLParser } from 'fast-xml-parser';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { Prelight } from './extract-prelights';
import { decodeAndReportFailures } from '../../decode-and-report-failures';

const itemCodec = t.type({
  pubDate: tt.DateFromISOString,
  category: t.string,
  guid: t.string,
  author: t.string,
  preprints: t.type({
    preprint: t.array(t.type({
      preprintdoi: t.string,
    })),
  }),
});

const prelightsFeedCodec = t.type({
  rss: t.type({
    channel: t.intersection([
      t.interface({ title: t.string }),
      t.partial({ item: t.array(itemCodec) }),
    ]),
  }),
}, 'prelightsFeedCodec');

type FeedItem = t.TypeOf<typeof itemCodec>;

const toIndividualPrelights = (item: FeedItem): Array<Prelight> => (
  item.preprints.preprint.map((preprintItem) => ({
    guid: item.guid,
    category: item.category,
    pubDate: item.pubDate,
    preprintDoi: preprintItem.preprintdoi,
    author: item.author,
  }))
);

const parser = new XMLParser({
  isArray: (name) => name === 'item' || name === 'preprint',
});

export const identifyCandidates = (responseBody: string): E.Either<string, ReadonlyArray<Prelight>> => pipe(
  parser.parse(responseBody),
  decodeAndReportFailures(prelightsFeedCodec),
  E.map(flow(
    (feed) => feed.rss.channel.item ?? [],
    RA.chain(toIndividualPrelights),
  )),
);
