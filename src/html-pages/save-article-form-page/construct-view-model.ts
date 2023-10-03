import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { sequenceS } from 'fp-ts/Apply';
import * as LID from '../../types/list-id';
import { Dependencies } from './dependencies';
import { Params } from './params';
import { ViewModel } from './view-model';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';

const listName = 'My test list';
const listId = LID.fromValidatedString('fake-list-id');

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  {
    article: dependencies.fetchArticle(params.articleId),
  },
  sequenceS(TE.ApplyPar),
  TE.map((partial) => ({
    articleId: params.articleId,
    articleTitle: partial.article.title,
    listId,
    listName,
    userListNames: [
      toHtmlFragment('List Name A'),
      toHtmlFragment('List Name B'),
    ],
  })),
);
