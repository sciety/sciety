import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { ListId } from '../../types/list-id';
import { Doi } from '../../types/doi';
import { Queries } from '../../read-models';
import { ArticleCardWithControlsAndAnnotationViewModel } from './article-card-with-controls-and-annotation-view-model';

export const constructAnnotation = (ports: Queries) => (listId: ListId, articleId: Doi): ArticleCardWithControlsAndAnnotationViewModel['annotation'] => pipe(
  ports.getAnnotationContent(listId, articleId),
  O.map((content) => ({
    content,
    author: 'AvasthiReading',
  })),
);
