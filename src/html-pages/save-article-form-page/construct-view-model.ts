import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as LID from '../../types/list-id';
import { Dependencies } from './dependencies';
import { Params } from './params';
import { ViewModel } from './view-model';
import * as DE from '../../types/data-error';

const listName = 'My test list';
const listId = LID.fromValidatedString('fake-list-id');

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  params.articleId,
  dependencies.fetchArticle,
  TE.map((articleDetails) => articleDetails.title),
  TE.map((articleTitle) => ({
    articleId: params.articleId,
    articleTitle,
    listId,
    listName,
  })),
);
