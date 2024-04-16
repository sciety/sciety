import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { toPageOfCards } from './to-page-of-cards';
import { ArticleId } from '../../../../types/article-id';
import * as EDOI from '../../../../types/expression-doi';
import { ListId } from '../../../../types/list-id';
import { ViewModel } from '../view-model';

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
