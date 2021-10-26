import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { FeedData, SkippedItem } from '../update-all';

const toDoi = (fetchData: FetchData) => (item: Prelight): TE.TaskEither<SkippedItem, string> => pipe(
  fetchData(item.preprintUrl),
  TE.mapLeft((e) => ({ item: item.guid, reason: e })),
  TE.chainEitherKW(flow(
    (doc) => new JSDOM(doc),
    (dom) => dom.window.document.querySelector('meta[name="DC.Identifier"]'),
    (meta) => meta?.getAttribute('content'),
    O.fromNullable,
    E.fromOption(() => ({ item: item.guid, reason: 'No DC.Identifier found' })),
    E.filterOrElse(
      (doi) => doi.startsWith('10.1101/'),
      () => ({ item: item.guid, reason: 'Not a biorxiv DOI' }),
    ),
  )),
);

export type Prelight = {
  guid: string,
  category: string,
  pubDate: Date,
  preprintUrl: string,
  author: string,
};

type FetchData = (url: string) => TE.TaskEither<string, string>;

export const extractPrelights = (fetchData: FetchData) => (items: ReadonlyArray<Prelight>): T.Task<FeedData> => pipe(
  items,
  T.traverseArray((item) => pipe(
    item,
    TE.right,
    TE.filterOrElse(
      (i) => i.category.includes('highlight'),
      (i) => ({ item: i.guid, reason: `Category was '${item.category}` }),
    ),
    TE.chain(toDoi(fetchData)),
    TE.map((articleDoi) => ({
      date: item.pubDate,
      articleDoi,
      evaluationLocator: `prelights:${item.guid.replace('&#038;', '&')}`,
      authors: [item.author],
    })),
  )),
  T.map((things) => ({
    evaluations: RA.rights(things),
    skippedItems: RA.lefts(things),
  })),
);
