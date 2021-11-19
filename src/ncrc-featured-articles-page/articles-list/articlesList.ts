import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { toPageOfCards, Ports as ToPageOfCardsPorts } from './to-page-of-cards';
import { DomainEvent } from '../../domain-events';
import { noEvaluatedArticlesMessage } from '../../list-page/evaluated-articles-list/static-messages';
import { paginate } from '../../shared-components/paginate';
import { activityFor, allArticleActivity } from '../../shared-read-models/all-article-activity';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { HtmlFragment } from '../../types/html-fragment';

export type Ports = ToPageOfCardsPorts & {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

const doiList = [
  new Doi('10.1101/2021.05.20.21257512'),
];

export const articlesList = (
  ports: Ports,
  listId: string,
  pageNumber: number,
): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  doiList,
  T.traverseArray((doi) => pipe(
    ports.getAllEvents,
    T.map(allArticleActivity),
    T.map(activityFor(doi)),
  )),
  TE.rightTask,
  TE.chain(RA.match(
    () => TE.right(noEvaluatedArticlesMessage),
    flow(
      paginate(20, pageNumber),
      TE.fromEither,
      TE.chainTaskK(toPageOfCards(ports, listId)),
    ),
  )),
);
