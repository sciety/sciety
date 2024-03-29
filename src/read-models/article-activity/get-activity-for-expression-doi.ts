import * as RM from 'fp-ts/ReadonlyMap';
import * as O from 'fp-ts/Option';
import * as S from 'fp-ts/string';
import { pipe } from 'fp-ts/function';
import { ExpressionActivity } from '../../types/expression-activity';
import { ArticleId } from '../../types/article-id';
import { ReadModel } from './handle-event';
import { ExpressionDoi } from '../../types/expression-doi';

type GetActivityForExpressionDoi = (expressionDoi: ExpressionDoi) => ExpressionActivity;

export const getActivityForExpressionDoi = (
  readmodel: ReadModel,
): GetActivityForExpressionDoi => (expressionDoi) => pipe(
  readmodel,
  RM.lookup(S.Eq)(expressionDoi),
  O.match(
    () => ({
      expressionDoi: new ArticleId(expressionDoi),
      listMembershipCount: 0,
    }),
    (act) => ({
      expressionDoi: act.articleId,
      listMembershipCount: act.lists.size,
    }),
  ),
);
