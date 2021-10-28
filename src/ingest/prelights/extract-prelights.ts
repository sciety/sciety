import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { FeedData } from '../update-all';

export type Prelight = {
  guid: string,
  category: string,
  pubDate: Date,
  preprintDoi: string,
  preprintUrl: string,
  author: string,
};

export const extractPrelights = (items: ReadonlyArray<Prelight>): T.Task<FeedData> => pipe(
  items,
  T.traverseArray(flow(
    TE.right,
    TE.filterOrElse(
      (i) => i.category.includes('highlight'),
      (i) => ({ item: i.guid, reason: `Category was '${i.category}` }),
    ),
    TE.filterOrElse(
      (i) => i.preprintDoi !== '',
      (i) => ({ item: i.guid, reason: 'preprintDoi field is empty' }),
    ),
    TE.filterOrElse(
      (i) => i.preprintDoi.startsWith('10.1101/'),
      (i) => ({ item: i.guid, reason: 'Not a biorxiv DOI' }),
    ),
    TE.map(({
      pubDate, preprintDoi, guid, author,
    }) => ({
      date: pubDate,
      articleDoi: preprintDoi,
      evaluationLocator: `prelights:${guid.replace('&#038;', '&')}`,
      authors: [author],
    })),
  )),
  T.map((things) => ({
    evaluations: RA.rights(things),
    skippedItems: RA.lefts(things),
  })),
);
