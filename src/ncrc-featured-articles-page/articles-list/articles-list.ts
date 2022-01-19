import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { DomainEvent } from '../../domain-events';
import { populateArticleActivities } from '../../list-page/evaluated-articles-list/populate-article-activities';
import { noEvaluatedArticlesMessage } from '../../list-page/evaluated-articles-list/static-messages';
import { toPageOfCards, Ports as ToPageOfCardsPorts } from '../../list-page/evaluated-articles-list/to-page-of-cards';
import { paginate } from '../../shared-components/paginate';
import { selectArticlesBelongingToList } from '../../shared-read-models/list-articles';
import * as DE from '../../types/data-error';
import { HtmlFragment } from '../../types/html-fragment';

export type Ports = ToPageOfCardsPorts & {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

export const articlesList = (
  ports: Ports,
  listId: string,
  pageNumber: number,
): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  ports.getAllEvents,
  T.map(selectArticlesBelongingToList(listId)),
  TE.chain(RA.match(
    () => TE.right(noEvaluatedArticlesMessage),
    flow(
      paginate(20, pageNumber),
      TE.fromEither,
      TE.chainTaskK(populateArticleActivities(ports)),
      TE.chainTaskK(toPageOfCards(ports, `/lists/${listId}`)),
    ),
  )),
);
