import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { ArticleId } from '../../../types/article-id';
import { ListOwnerId } from '../../../types/list-owner-id';
import { ViewModel } from '../view-model';
import { Dependencies } from './dependencies';
import { ExpressionDoi } from '../../../types/expression-doi';

const getListOwnerName = (dependencies: Dependencies) => (ownerId: ListOwnerId) => {
  switch (ownerId.tag) {
    case 'group-id':
      return pipe(
        ownerId.value,
        dependencies.getGroup,
        O.match(
          () => {
            dependencies.logger('error', 'Consistency error in article page: Failed to get list owner', { ownerId });
            return 'A group';
          },
          (group) => group.name,
        ),
      );

    case 'user-id':
      return pipe(
        ownerId.value,
        dependencies.lookupUser,
        O.match(
          () => {
            dependencies.logger('error', 'Consistency error in article page: Failed to get list owner', { ownerId });
            return 'A user';
          },
          (user) => user.handle,
        ),
      );
  }
};

export const constructListedIn = (dependencies: Dependencies) => (expressionDoi: ExpressionDoi): ViewModel['listedIn'] => pipe(
  new ArticleId(expressionDoi),
  dependencies.selectAllListsContainingArticle,
  RA.map((list) => ({
    listId: list.id,
    listName: list.name,
    listOwnerName: getListOwnerName(dependencies)(list.ownerId),
    listHref: `/lists/${list.id}`,
  })),
);
