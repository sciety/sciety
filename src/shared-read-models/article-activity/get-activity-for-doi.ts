import * as O from 'fp-ts/Option';
import * as RM from 'fp-ts/ReadonlyMap';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { constructAllArticleActivityReadModel } from './construct-all-article-activity-read-model';
import { DomainEvent } from '../../domain-events';
import { ArticleActivity } from '../../types/article-activity';
import { Doi } from '../../types/doi';

export const getActivityForDoi = (
  doi: Doi,
) => (
  events: ReadonlyArray<DomainEvent>,
): ArticleActivity => pipe(
  events,
  constructAllArticleActivityReadModel,
  RM.lookup(S.Eq)(doi.value),
  O.getOrElseW(() => ({
    doi,
    latestActivityDate: O.none,
    evaluationCount: 0,
    listMembershipCount: 0,
  })),
);
