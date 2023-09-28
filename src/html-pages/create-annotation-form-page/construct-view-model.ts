import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Queries } from '../../read-models';
import { ExternalQueries } from '../../third-parties/external-queries';
import { ViewModel } from './view-model';
import { DataError } from '../../types/data-error';
import { Doi } from '../../types/doi';
import { ListId } from '../../types/list-id';
import * as LID from '../../types/list-id';

export type Dependencies = Queries & ExternalQueries;

const getArticleTitle = (dependencies: Dependencies, articleId: Doi) => pipe(
  articleId,
  dependencies.fetchArticle,
  TE.map((articleDetails) => articleDetails.title),
);

const getListName = (dependencies: Dependencies, listId: ListId) => pipe(
  listId,
  dependencies.lookupList,
  O.map((list) => list.name),
);

export const constructViewModel = (
  articleId: string,
  listId: string,
  dependencies: Dependencies,
): TE.TaskEither<DataError, ViewModel> => pipe(
  getArticleTitle(dependencies, new Doi(articleId)),
  TE.map((articleTitle) => ({
    articleId,
    listId,
    articleTitle,
    listName: pipe(
      getListName(dependencies, LID.fromValidatedString(listId)),
      O.match(
        () => '',
        (listName) => listName,
      ),
    ),
  })),
);
