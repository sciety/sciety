import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { flow, pipe } from 'fp-ts/function';
import { DiscoveredPublishedEvaluations } from '../../types/discovered-published-evaluations';
import { constructPublishedEvaluation } from '../../types/published-evaluation';

export type Prelight = {
  guid: string,
  category: string,
  pubDate: Date,
  author: string,
  preprintDoi?: string,
};

type PrelightWithPreprintDoi = Required<Prelight>;

const skipWithReason = (item: Prelight, reason: string) => ({ item: item.guid, reason });

const toEvaluation = (prelight: PrelightWithPreprintDoi) => constructPublishedEvaluation({
  publishedOn: prelight.pubDate,
  paperExpressionDoi: prelight.preprintDoi,
  evaluationLocator: `prelights:${prelight.guid.replace('&#038;', '&')}`,
  authors: [prelight.author],
});

export const extractPrelights = (items: ReadonlyArray<Prelight>): DiscoveredPublishedEvaluations => pipe(
  items,
  RA.map(flow(
    E.right,
    E.filterOrElse(
      (i) => i.category.includes('highlight'),
      (i) => skipWithReason(i, `Category was '${i.category}`),
    ),
    E.filterOrElse(
      (i): i is PrelightWithPreprintDoi => i.preprintDoi !== undefined,
      (i) => skipWithReason(i, 'no preprintDoi field'),
    ),
    E.filterOrElse(
      (i) => i.preprintDoi !== '',
      (i) => skipWithReason(i, 'preprintDoi field is empty'),
    ),
    E.filterOrElse(
      (i) => i.preprintDoi.startsWith('10.1101/') || i.preprintDoi.startsWith('10.64898/'),
      (i) => skipWithReason(i, `${i.preprintDoi} is not a biorxiv or medrxiv DOI`),
    ),
    E.map(toEvaluation),
  )),
  (evaluationsOrSkippedItems) => ({
    understood: RA.rights(evaluationsOrSkippedItems),
    skipped: RA.lefts(evaluationsOrSkippedItems),
  }),
);
