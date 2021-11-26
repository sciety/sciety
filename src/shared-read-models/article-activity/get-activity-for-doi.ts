import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { constructAllArticleActivityReadModel } from './construct-all-article-activity-read-model';
import { DomainEvent } from '../../domain-events';
import { ArticleActivity } from '../../types/article-activity';
import { Doi } from '../../types/doi';

export type AllArticleActivityReadModel = Map<string, ArticleActivity>;

export const getActivityForDoi = (
  doi: Doi,
) => (
  events: ReadonlyArray<DomainEvent>,
): ArticleActivity => pipe(
  events,
  constructAllArticleActivityReadModel,
  (activities) => activities.get(doi.value),
  O.fromNullable,
  O.getOrElseW(() => ({
    doi,
    latestActivityDate: O.none,
    evaluationCount: 0,
  })),
);
