import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { constructAllArticleActivityReadModel } from './construct-all-article-activity-read-model';
import { DomainEvent } from '../../domain-events';
import { ArticleActivity } from '../../types/article-activity';
import { Doi } from '../../types/doi';

type GetActivityForDois = (articleIds: ReadonlyArray<Doi>)
=> (events: ReadonlyArray<DomainEvent>)
=> ReadonlyArray<ArticleActivity>;

export const getActivityForDois: GetActivityForDois = (articleIds) => (events) => pipe(
  events,
  constructAllArticleActivityReadModel,
  (readmodel) => pipe(
    articleIds,
    RA.map((articleId) => pipe(
      readmodel,
      RM.lookup(S.Eq)(articleId.value),
      O.map((act) => ({
        articleId: act.articleId,
        latestActivityDate: act.latestActivityDate,
        evaluationCount: act.evaluationCount,
        listMembershipCount: act.listMembershipCount,
      })),
      O.getOrElseW(() => ({
        articleId,
        latestActivityDate: O.none,
        evaluationCount: 0,
        listMembershipCount: 0,
      })),
    )),
  ),
);
