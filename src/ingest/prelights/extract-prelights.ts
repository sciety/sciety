import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { flow, pipe } from 'fp-ts/function';
import { FeedData } from '../update-all';

export type Prelight = {
  guid: string,
  category: string,
  pubDate: Date,
  preprintDoi: string,
  author: string,
};

export const extractPrelights = (items: ReadonlyArray<Prelight>): FeedData => pipe(
  items,
  RA.map(flow(
    E.right,
    E.filterOrElse(
      (i) => i.category.includes('highlight'),
      (i) => ({ item: i.guid, reason: `Category was '${i.category}` }),
    ),
    E.filterOrElse(
      (i) => i.preprintDoi !== '',
      (i) => ({ item: i.guid, reason: 'preprintDoi field is empty' }),
    ),
    E.filterOrElse(
      (i) => i.preprintDoi.startsWith('10.1101/'),
      (i) => ({ item: i.guid, reason: `${i.preprintDoi} is not a biorxiv or medrxiv DOI` }),
    ),
    E.map(({
      pubDate, preprintDoi, guid, author,
    }) => ({
      date: pubDate,
      articleDoi: preprintDoi,
      evaluationLocator: `prelights:${guid.replace('&#038;', '&')}`,
      authors: [author],
    })),
  )),
  (evaluationsOrSkippedItems) => ({
    evaluations: RA.rights(evaluationsOrSkippedItems),
    skippedItems: RA.lefts(evaluationsOrSkippedItems),
  }),
);
