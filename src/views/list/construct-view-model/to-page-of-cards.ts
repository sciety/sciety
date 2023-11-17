import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import {
  constructArticleCardWithControlsAndAnnotation,
} from '../../../shared-components/article-card-with-controls-and-annotation/index.js';
import { ArticleActivity } from '../../../types/article-activity.js';
import { ListId } from '../../../types/list-id.js';
import { Dependencies } from './dependencies.js';
import { ViewModel } from '../view-model.js';

export const toPageOfCards = (
  dependencies: Dependencies,
  listId: ListId,
) => (
  items: ReadonlyArray<ArticleActivity>,
): T.Task<ViewModel['articles']> => pipe(
  items,
  RA.map((item) => item.articleId),
  T.traverseArray(constructArticleCardWithControlsAndAnnotation(dependencies, false, listId)),
  T.map(RA.rights),
);
