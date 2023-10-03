import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
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
    userListNames: pipe(
      params.user,
      O.map((user) => user.id),
      O.map(LOID.fromUserId),
      O.map(dependencies.selectAllListsOwnedBy),
      O.map(RA.map((list) => toHtmlFragment(list.name))),
      TE.fromOption(() => DE.unavailable),
    ),
  },
  sequenceS(TE.ApplyPar),
  TE.map((partial) => ({
    articleId: params.articleId,
    articleTitle: partial.article.title,
    userListNames: partial.userListNames,
  })),
);
