import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ArticleId } from '../../../types/article-id';
import { UserId } from '../../../types/user-id';
import * as LOID from '../../../types/list-owner-id';
import { sortByDefaultListOrdering } from '../../sort-by-default-list-ordering';
import { ViewModel } from '../view-model';
import { Dependencies } from './dependencies';

export const constructUserListManagement = (user: O.Option<{ id: UserId }>, dependencies: Dependencies, articleId: ArticleId): ViewModel['userListManagement'] => pipe(
  user,
  O.map(
    ({ id }) => pipe(
      dependencies.selectListContainingArticle(id)(articleId),
      O.foldW(
        () => pipe(
          id,
          LOID.fromUserId,
          dependencies.selectAllListsOwnedBy,
          sortByDefaultListOrdering,
          RA.map((list) => ({
            listId: list.id,
            listName: list.name,
          })),
          (lists) => E.left({
            lists,
            saveArticleHref: `/save-article?articleId=${articleId.value}`,
          }),
        ),
        (list) => E.right({
          listId: list.id,
          listName: list.name,
        }),
      ),
    ),
  ),
);
