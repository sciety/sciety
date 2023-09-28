import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Queries } from '../../read-models';
import { ExternalQueries } from '../../third-parties/external-queries';
import { ViewModel } from './view-model';
import { DataError } from '../../types/data-error';
import { Doi } from '../../types/doi';

export type Dependencies = Queries & ExternalQueries;

const getArticleTitle = (dependencies: Dependencies, articleId: Doi) => pipe(
  articleId,
  dependencies.fetchArticle,
  TE.map((articleDetails) => articleDetails.title),
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
    listName: '',
  })),
);
