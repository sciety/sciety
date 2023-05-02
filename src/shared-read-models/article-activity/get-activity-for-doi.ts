import * as RM from 'fp-ts/ReadonlyMap';
import * as O from 'fp-ts/Option';
import * as S from 'fp-ts/string';
import { pipe } from 'fp-ts/function';
import { ArticleActivity } from '../../types/article-activity';
import { Doi } from '../../types/doi';
import { ReadModel } from './handle-event';

type GetActivityForDoi = (articleId: Doi) => ArticleActivity;

export const getActivityForDoi = (readmodel: ReadModel): GetActivityForDoi => (articleId) => pipe(
  readmodel,
  RM.lookup(S.Eq)(articleId.value),
  O.match(
    () => ({
      articleId,
      latestActivityDate: O.none,
      evaluationCount: 0,
      listMembershipCount: 0,
    }),
    (act) => ({
      articleId: act.articleId,
      latestActivityDate: act.latestActivityDate,
      evaluationCount: act.evaluationLocators.length,
      listMembershipCount: act.listMembershipCount,
    }),
  ),
);
