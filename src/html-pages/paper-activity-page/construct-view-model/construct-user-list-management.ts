import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { ExpressionDoi } from '../../../types/expression-doi';
import { UserId } from '../../../types/user-id';
import { ViewModel } from '../view-model';

export const constructUserListManagement = (user: O.Option<{ id: UserId }>, dependencies: Dependencies, expressionDoi: ExpressionDoi): ViewModel['userListManagement'] => pipe(
  user,
  O.map(
    (u) => pipe(
      expressionDoi,
      dependencies.selectListContainingExpression(u.id),
      O.matchW(
        () => E.left({
          saveArticleHref: `/save-article?articleId=${expressionDoi}`,
        }),
        (list) => E.right({
          listId: list.id,
          listName: list.name,
          listHref: `/lists/${list.id}`,
        }),
      ),
    ),
  ),
);
