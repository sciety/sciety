import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { toPageOfCards, Ports as ToPageOfCardsPorts } from './to-page-of-cards';
import { noEvaluatedArticlesMessage } from '../../list-page/evaluated-articles-list/static-messages';
import { paginate } from '../../shared-components/paginate';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { HtmlFragment } from '../../types/html-fragment';

export type Ports = ToPageOfCardsPorts;

export const articlesList = (
  ports: Ports,
  listId: string,
  pageNumber: number,
): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  [
    {
      doi: new Doi('10.1101/2021.05.20.21257512'),
      latestActivityDate: new Date('2021-07-09'),
      evaluationCount: 2,
    },
  ],
  TE.right,
  TE.chain(RA.match(
    () => TE.right(noEvaluatedArticlesMessage),
    flow(
      paginate(20, pageNumber),
      TE.fromEither,
      TE.chainTaskK(toPageOfCards(ports, listId)),
    ),
  )),
);
