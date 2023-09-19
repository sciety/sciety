import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { ListId } from '../../types/list-id';
import { Doi } from '../../types/doi';
import { Queries } from '../../read-models';
import { ArticleCardWithControlsAndAnnotationViewModel } from './article-card-with-controls-and-annotation-view-model';

const getAnnotationAuthorDisplayName = (ports: Queries, listId: ListId) => pipe(
  listId,
  ports.lookupList,
  O.map((list) => list.ownerId),
  O.match(
    () => 'An unknown author',
    () => 'AvasthiReading',
  ),
);

export const constructAnnotation = (ports: Queries) => (listId: ListId, articleId: Doi): ArticleCardWithControlsAndAnnotationViewModel['annotation'] => pipe(
  ports.getAnnotationContent(listId, articleId),
  O.map((content) => ({
    content,
    author: getAnnotationAuthorDisplayName(ports, listId),
  })),
);
