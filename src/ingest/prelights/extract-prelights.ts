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

const skipWithReason = (item: Prelight, reason: string) => ({ item: item.guid, reason });

const toEvaluation = (prelight: Prelight) => ({
  date: prelight.pubDate,
  articleDoi: prelight.preprintDoi,
  evaluationLocator: `prelights:${prelight.guid.replace('&#038;', '&')}`,
  authors: [prelight.author],
});

export const extractPrelights = (items: ReadonlyArray<Prelight>): FeedData => pipe(
  items,
  RA.map(flow(
    E.right,
    E.filterOrElse(
      (i) => i.category.includes('highlight'),
      (i) => skipWithReason(i, `Category was '${i.category}`),
    ),
    E.filterOrElse(
      (i) => i.preprintDoi !== '',
      (i) => skipWithReason(i, 'preprintDoi field is empty'),
    ),
    E.filterOrElse(
      (i) => i.preprintDoi.startsWith('10.1101/'),
      (i) => skipWithReason(i, `${i.preprintDoi} is not a biorxiv or medrxiv DOI`),
    ),
    E.map(toEvaluation),
  )),
  (evaluationsOrSkippedItems) => ({
    evaluations: RA.rights(evaluationsOrSkippedItems),
    skippedItems: RA.lefts(evaluationsOrSkippedItems),
  }),
);
