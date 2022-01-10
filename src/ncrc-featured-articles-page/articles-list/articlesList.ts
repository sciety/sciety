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
import { getActivityForDoi } from '../../shared-read-models/article-activity';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { HtmlFragment } from '../../types/html-fragment';
import { lists } from '../lists';

export type Ports = ToPageOfCardsPorts & {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

type SelectArticlesBelongingToList = (listId: string)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<DE.DataError, ReadonlyArray<Doi>>;

const selectArticlesBelongingToList: SelectArticlesBelongingToList = (listId) => () => pipe(
  lists,
  R.lookup(listId),
  E.fromOption(() => DE.notFound),
);

export const articlesList = (
  ports: Ports,
  listId: string,
  pageNumber: number,
): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  ports.getAllEvents,
  T.map(selectArticlesBelongingToList(listId)),
  TE.chainTaskK((dois) => pipe(
    ports.getAllEvents,
    T.map((events) => RA.map((doi: Doi) => getActivityForDoi(doi)(events))(dois)),
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
