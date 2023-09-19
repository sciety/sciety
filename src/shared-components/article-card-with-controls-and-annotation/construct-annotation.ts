import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { ListId } from '../../types/list-id';
import { Doi } from '../../types/doi';
import { Queries } from '../../read-models';
import { ArticleCardWithControlsAndAnnotationViewModel } from './article-card-with-controls-and-annotation-view-model';
import { unknownAuthor } from './static-messages';

const getAnnotationAuthorDisplayName = (dependencies: Queries, listId: ListId) => pipe(
  listId,
  dependencies.lookupList,
  O.map((list) => list.ownerId),
  O.match(
    () => unknownAuthor,
    (ownerId) => {
      switch (ownerId.tag) {
        case 'group-id':
          return pipe(
            ownerId.value,
            dependencies.getGroup,
            O.map((group) => group.name),
            O.getOrElse(() => unknownAuthor),
          );
        case 'user-id':
          return pipe(
            ownerId.value,
            dependencies.lookupUser,
            O.map((user) => user.displayName),
            O.getOrElse(() => unknownAuthor),
          );
      }
    },
  ),
);

export const constructAnnotation = (dependencies: Queries) => (listId: ListId, articleId: Doi): ArticleCardWithControlsAndAnnotationViewModel['annotation'] => pipe(
  dependencies.getAnnotationContent(listId, articleId),
  O.map((content) => ({
    content,
    author: getAnnotationAuthorDisplayName(dependencies, listId),
  })),
);
