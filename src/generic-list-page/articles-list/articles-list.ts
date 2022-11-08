import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { populateArticleActivities } from './populate-article-activities';
import { renderComponentWithPagination } from './render-component-with-pagination';
import { toPageOfCards, Ports as ToPageOfCardsPorts } from './to-page-of-cards';
import { DomainEvent } from '../../domain-events';
import { paginate } from '../../shared-components/paginate';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { HtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';

export type Ports = ToPageOfCardsPorts & {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

export const articlesList = (
  ports: Ports,
  listId: ListId,
  pageNumber: number,
  hasArticleControls: boolean,
) => (articleIds: ReadonlyArray<Doi>): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  articleIds,
  paginate(20, pageNumber),
  TE.fromEither,
  TE.chainTaskK(populateArticleActivities(ports)),
  TE.chainTaskK((pageOfArticles) => pipe(
    pageOfArticles,
    toPageOfCards(ports, hasArticleControls, listId),
    TE.map((articles) => ({ articles, pagination: pageOfArticles })),
    TE.map(renderComponentWithPagination(`/lists/${listId}`)),
    TE.toUnion,
  )),
);
