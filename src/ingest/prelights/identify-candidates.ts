import parser from 'fast-xml-parser';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';

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
    guid: item.guid,
    category: item.category,
    pubDate: item.pubDate,
    preprintUrl: item.preprints.preprint.preprinturl,
  }];
};

export const identifyCandidates = (responseBody: string): E.Either<string, ReadonlyArray<Prelight>> => pipe(
  parser.parse(responseBody, { arrayMode: /item/ }) as JSON,
  prelightsFeedCodec.decode,
  E.bimap(
    (errors) => PR.failure(errors).join('\n'),
    flow(
      (feed) => feed.rss.channel.item,
      RA.chain(toIndividualPrelights),
    ),
  ),
);
