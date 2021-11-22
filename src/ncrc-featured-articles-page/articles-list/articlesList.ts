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
import { Doi } from '../../types/doi';
import { HtmlFragment } from '../../types/html-fragment';

export type Ports = ToPageOfCardsPorts & {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

const doiList = {
  'cbd478fe-3ff7-4125-ac9f-c94ff52ae0f7': [
    new Doi('10.1101/2021.05.20.21257512'),
  ],
  '5ac3a439-e5c6-4b15-b109-92928a740812': [
    new Doi('10.1101/2021.03.21.436299'),
    new Doi('10.1101/2021.07.05.451181'),
  ],
};

export const articlesList = (
  ports: Ports,
  listId: string,
  pageNumber: number,
): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  ports.getAllEvents,
  T.map(allArticleActivity),
  T.map((model) => pipe(
    doiList,
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
