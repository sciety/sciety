import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { ArticleId } from '../../types/article-id';
import { List } from '../../types/list';

type SelectAllListsContainingExpression = (articleId: ArticleId) => ReadonlyArray<List>;

export const selectAllListsContainingExpression = (
  readModel: ReadModel,
): SelectAllListsContainingExpression => (articleId) => pipe(
  Object.values(readModel),
  RA.filter((list) => list.articleIds.includes(articleId.value)),
);
