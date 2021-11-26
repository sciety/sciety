import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, GroupEvaluatedArticleEvent, isGroupEvaluatedArticleEvent } from '../../domain-events';
import { ArticleActivity } from '../../types/article-activity';
import { Doi } from '../../types/doi';

export type AllArticleActivityReadModel = Map<string, ArticleActivity>;

type ConstructAllArticleActivityReadModel = (events: ReadonlyArray<DomainEvent>) => AllArticleActivityReadModel;

const addEventToActivities = (state: AllArticleActivityReadModel, event: GroupEvaluatedArticleEvent) => pipe(
  state.get(event.articleId.value),
  O.fromNullable,
  O.fold(
    () => state.set(event.articleId.value, {
      doi: event.articleId,
      latestActivityDate: O.some(event.date),
      evaluationCount: 1,
    }),
    (entry) => state.set(event.articleId.value, {
      ...entry,
      latestActivityDate: O.some(event.date),
      evaluationCount: entry.evaluationCount + 1,
    }),
  ),
);

export const constructAllArticleActivityReadModel: ConstructAllArticleActivityReadModel = (events) => pipe(
  events,
  RA.filter(isGroupEvaluatedArticleEvent),
  RA.reduce(new Map<string, ArticleActivity>(), addEventToActivities),
);

export const activityForDoi = (
  activities: AllArticleActivityReadModel,
) => (
  doi: Doi,
): ArticleActivity => pipe(
  activities.get(doi.value),
  O.fromNullable,
  O.getOrElseW(() => ({
    doi,
    latestActivityDate: O.none,
    evaluationCount: 0,
  })),
);
