import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import {
  constructArticleCardWithControlsAndAnnotationViewModel,
} from '../../../shared-components/article-card';
import { ArticleActivity } from '../../../types/article-activity';
import { ListId } from '../../../types/list-id';
import { Dependencies } from './dependencies';
import { ContentWithPaginationViewModel } from '../view-model';

export const toPageOfCards = (
  dependencies: Dependencies,
  listId: ListId,
) => (
  items: ReadonlyArray<ArticleActivity>,
): T.Task<ContentWithPaginationViewModel['articles']> => pipe(
  items,
  RA.map((item) => item.articleId),
  T.traverseArray(constructArticleCardWithControlsAndAnnotationViewModel(dependencies, false, listId)),
  T.map(RA.rights),
);
