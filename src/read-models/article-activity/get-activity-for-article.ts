import * as RM from 'fp-ts/ReadonlyMap';
import * as O from 'fp-ts/Option';
import * as S from 'fp-ts/string';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as D from 'fp-ts/Date';
import { ArticleActivity } from '../../types/article-activity.js';
import { ArticleId } from '../../types/article-id.js';
import { ReadModel } from './handle-event.js';

type GetActivityForArticle = (articleId: ArticleId) => ArticleActivity;

export const getActivityForArticle = (readmodel: ReadModel): GetActivityForArticle => (articleId) => pipe(
  readmodel,
  RM.lookup(S.Eq)(articleId.value),
  O.match(
    () => ({
      articleId,
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
