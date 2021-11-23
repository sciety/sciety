import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { toPageOfCards, Ports as ToPageOfCardsPorts } from './to-page-of-cards';
import { DomainEvent } from '../../domain-events';
import { noEvaluatedArticlesMessage } from '../../list-page/evaluated-articles-list/static-messages';
import { paginate } from '../../shared-components/paginate';
import { activityForDoi, allArticleActivity } from '../../shared-read-models/all-article-activity';
import * as DE from '../../types/data-error';
import { HtmlFragment } from '../../types/html-fragment';
import { lists } from '../lists';

export type Ports = ToPageOfCardsPorts & {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

export const articlesList = (
  ports: Ports,
  listId: string,
  pageNumber: number,
): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  ports.getAllEvents,
  T.map(allArticleActivity),
  T.map((model) => pipe(
    lists,
    R.lookup(listId),
    E.fromOption(() => DE.notFound),
    E.map(RA.map(activityForDoi(model))),
  )),
  TE.chain(RA.match(
    () => TE.right(noEvaluatedArticlesMessage),
    flow(
      paginate(20, pageNumber),
      TE.fromEither,
      TE.chainTaskK(toPageOfCards(ports, listId)),
    ),
  )),
);
