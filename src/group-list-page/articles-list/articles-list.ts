import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { populateArticleActivities } from './populate-article-activities';
import { noArticlesMessage } from './static-messages';
import { toPageOfCards, Ports as ToPageOfCardsPorts } from './to-page-of-cards';
import { DomainEvent } from '../../domain-events';
import { paginate } from '../../shared-components/paginate';
import { selectArticlesBelongingToList } from '../../shared-read-models/list-articles';
import * as DE from '../../types/data-error';
import { HtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';

export type Ports = ToPageOfCardsPorts & {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

export const articlesList = (
  ports: Ports,
  listId: ListId,
  pageNumber: number,
): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  ports.getAllEvents,
  T.map(selectArticlesBelongingToList(listId)),
  TE.chain(RA.match(
    () => TE.right(noArticlesMessage),
    flow(
      paginate(20, pageNumber),
      TE.fromEither,
      TE.chainTaskK(populateArticleActivities(ports)),
      TE.chainTaskK(toPageOfCards(ports, `/lists/${listId}`)),
    ),
  )),
);
