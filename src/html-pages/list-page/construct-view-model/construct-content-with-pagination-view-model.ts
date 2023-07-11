import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { populateArticleActivities } from './populate-article-activities';
import { toPageOfCards } from './to-page-of-cards';
import { paginate } from '../../../shared-components/paginate';
import * as DE from '../../../types/data-error';
import { Doi } from '../../../types/doi';
import { ContentWithPaginationViewModel } from '../view-model';
import { ListId } from '../../../types/list-id';
import { Dependencies } from './dependencies';

export const constructContentWithPaginationViewModel = (
  dependencies: Dependencies,
  pageNumber: number,
  editCapability: boolean,
  listId: ListId,
) => (articleIds: ReadonlyArray<Doi>): TE.TaskEither<DE.DataError | 'no-articles-can-be-fetched', ContentWithPaginationViewModel> => pipe(
  articleIds,
  paginate(20, pageNumber),
  E.map(populateArticleActivities(dependencies)),
  TE.fromEither,
  TE.chainW((pageOfArticles) => pipe(
    pageOfArticles.items,
    toPageOfCards(dependencies, editCapability, listId),
    TE.map((articles) => ({ articles, pagination: pageOfArticles })),
  )),
);
