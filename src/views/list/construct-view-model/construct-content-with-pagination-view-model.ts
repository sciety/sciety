import * as T from 'fp-ts/Task';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { toPageOfCards } from './to-page-of-cards';
import { ArticleId } from '../../../types/article-id';
import { ViewModel } from '../view-model';
import { ListId } from '../../../types/list-id';
import { Dependencies } from './dependencies';
import * as EDOI from '../../../types/expression-doi';

export const constructContentWithPaginationViewModel = (
  dependencies: Dependencies,
  listId: ListId,
) => (articleIds: ReadonlyArray<ArticleId>): T.Task<ViewModel['articles']> => pipe(
  articleIds,
  RA.takeLeft(20),
  RA.map((articleId) => EDOI.fromValidatedString(articleId.value)),
  RA.map(dependencies.getActivityForExpressionDoi),
  toPageOfCards(dependencies, listId),
);
