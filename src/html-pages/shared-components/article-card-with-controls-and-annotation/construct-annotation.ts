import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { missingAvatarFallback, unknownAuthor } from './static-content';
import { ViewModel } from './view-model';
import { Queries } from '../../../read-models';
import { constructUserAvatarSrc } from '../../../read-side/paths';
import { ArticleId } from '../../../types/article-id';
import { ExpressionDoi } from '../../../types/expression-doi';
import { GroupId } from '../../../types/group-id';
import { ListId } from '../../../types/list-id';
import { UserId } from '../../../types/user-id';

const getGroupName = (dependencies: Queries, groupId: GroupId) => pipe(
  groupId,
  dependencies.getGroup,
  O.map((group) => group.name),
);

const getGroupAvatarPath = (dependencies: Queries, groupId: GroupId) => pipe(
  groupId,
  dependencies.getGroup,
  O.map((group) => group.avatarPath),
);

const getUserDisplayName = (dependencies: Queries, userId: UserId) => pipe(
  userId,
  dependencies.lookupUser,
  O.map((user) => user.displayName),
);

const getUserAvatarPath = (dependencies: Queries, userId: UserId) => pipe(
  userId,
  dependencies.lookupUser,
  O.map(constructUserAvatarSrc),
);

const getAnnotationAuthor = (dependencies: Queries, listId: ListId) => pipe(
  listId,
  dependencies.lookupList,
  O.map((list) => list.ownerId),
  O.chain((ownerId) => {
    switch (ownerId.tag) {
      case 'group-id':
        return getGroupName(dependencies, ownerId.value);
      case 'user-id':
        return getUserDisplayName(dependencies, ownerId.value);
    }
  }),
);

const getAnnotationAuthorAvatarPath = (dependencies: Queries, listId: ListId) => pipe(
  listId,
  dependencies.lookupList,
  O.map((list) => list.ownerId),
  O.chain((ownerId) => {
    switch (ownerId.tag) {
      case 'group-id':
        return getGroupAvatarPath(dependencies, ownerId.value);
      case 'user-id':
        return getUserAvatarPath(dependencies, ownerId.value);
    }
  }),
);

export const constructAnnotation = (dependencies: Queries) => (listId: ListId, expressionDoi: ExpressionDoi): ViewModel['annotation'] => pipe(
  dependencies.getAnnotationContent(listId, new ArticleId(expressionDoi)),
  O.map((content) => ({
    content,
    author: pipe(
      getAnnotationAuthor(dependencies, listId),
      O.getOrElse(() => unknownAuthor),
    ),
    authorAvatarSrc: pipe(
      getAnnotationAuthorAvatarPath(dependencies, listId),
      O.getOrElse(() => missingAvatarFallback),
    ),
  })),
);
