import * as RM from 'fp-ts/ReadonlyMap';
import * as O from 'fp-ts/Option';
import * as S from 'fp-ts/string';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as D from 'fp-ts/Date';
import { ArticleActivity } from '../../types/article-activity';
import { ArticleId } from '../../types/article-id';
import { ReadModel } from './handle-event';
import { ExpressionDoi } from '../../types/expression-doi';

type GetActivityForArticle = (expressionDoi: ExpressionDoi) => ArticleActivity;

export const getActivityForArticle = (readmodel: ReadModel): GetActivityForArticle => (expressionDoi) => pipe(
  readmodel,
  RM.lookup(S.Eq)(expressionDoi),
  O.match(
    () => ({
      articleId: new ArticleId(expressionDoi),
      latestActivityAt: O.none,
      evaluationCount: 0,
      listMembershipCount: 0,
    }),
    (act) => ({
      articleId: act.articleId,
      latestActivityAt: pipe(
        act.evaluationStates,
        RA.map((evaluationState) => evaluationState.publishedAt),
        RA.sort(D.Ord),
        RA.last,
      ),
      evaluationCount: act.evaluationStates.length,
      listMembershipCount: act.lists.size,
    }),
  ),
);
