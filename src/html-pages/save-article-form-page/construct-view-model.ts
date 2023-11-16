import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { sequenceS } from 'fp-ts/Apply';
import * as LOID from '../../types/list-owner-id';
import { Dependencies } from './dependencies';
import { Params } from './params';
import { ViewModel } from './view-model';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  {
    article: dependencies.fetchArticle(params.articleId),
    userLists: pipe(
      params.user,
      O.map((user) => user.id),
      O.map(LOID.fromUserId),
      O.map(dependencies.selectAllListsOwnedBy),
      TE.fromOption(() => {
        dependencies.logger('error', 'Tried to save an article, but no user is available');
        return DE.unavailable;
      }),
    ),
  },
  sequenceS(TE.ApplyPar),
  TE.map((partial) => ({
    article: {
      name: partial.article.title,
      id: params.articleId,
    },
    userLists: partial.userLists,
    pageHeading: toHtmlFragment('Save an article to your list'),
  } satisfies ViewModel)),
);
