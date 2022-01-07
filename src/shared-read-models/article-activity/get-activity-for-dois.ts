import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { constructAllArticleActivityReadModel } from './construct-all-article-activity-read-model';
import { DomainEvent } from '../../domain-events';
import { ArticleActivity } from '../../types/article-activity';
import { Doi } from '../../types/doi';

type GetActivityForDois = (dois: ReadonlyArray<Doi>)
=> (events: ReadonlyArray<DomainEvent>)
=> ReadonlyArray<ArticleActivity>;

// ts-unused-exports:disable-next-line
export const getActivityForDois: GetActivityForDois = (dois) => (events) => pipe(
  events,
  constructAllArticleActivityReadModel,
  (readmodel) => pipe(
    dois,
    RA.map((doi) => pipe(
      readmodel,
      RM.lookup(S.Eq)(doi.value),
      O.map((act) => ({
        doi: act.doi,
        latestActivityDate: act.latestActivityDate,
        evaluationCount: act.evaluationCount,
        listMembershipCount: act.listMembershipCount,
      })),
      O.getOrElseW(() => ({
        doi,
        latestActivityDate: O.none,
        evaluationCount: 0,
        listMembershipCount: 0,
      })),
    )),
  ),
);
