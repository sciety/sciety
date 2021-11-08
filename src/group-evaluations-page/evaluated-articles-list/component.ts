import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { evaluatedArticles } from './evaluated-articles';
import { toPageOfCards, Ports as ToPageOfCardsPorts } from './to-page-of-cards';
import { DomainEvent } from '../../domain-events';
import { paginate } from '../../shared-components/paginate';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { HtmlFragment } from '../../types/html-fragment';

export type Ports = ToPageOfCardsPorts & {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

const emptyPage = (pageNumber: number) => () => E.right({
  items: [],
  nextPage: O.none,
  pageNumber,
  numberOfOriginalItems: 0,
  numberOfPages: 0,
});

export const component = (
  ports: Ports,
  group: Group,
  pageNumber: number,
): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  ports.getAllEvents,
  T.map(evaluatedArticles(group.id)),
  TE.rightTask,
  TE.chainEitherK(RA.match(emptyPage(pageNumber), paginate(20, pageNumber))),
  TE.chainTaskK(toPageOfCards(ports, group)),
);
