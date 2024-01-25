import * as O from 'fp-ts/Option';
import { ArticleId } from './article-id';

export type ExpressionActivity = {
  expressionDoi: ArticleId,
  latestActivityAt: O.Option<Date>,
  listMembershipCount: number,
};
