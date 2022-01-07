import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, EvaluationRecordedEvent, isEvaluationRecordedEvent } from '../../domain-events';
import { ArticleActivity } from '../../types/article-activity';

const mostRecentDate = (a: Date) => (b: Date) => (a.getTime() > b.getTime() ? a : b);

type AllArticleActivityReadModel = Map<string, ArticleActivity>;

const addEventToActivities = (state: AllArticleActivityReadModel, event: EvaluationRecordedEvent) => pipe(
  state.get(event.articleId.value),
  O.fromNullable,
  O.fold(
    () => state.set(event.articleId.value, {
      doi: event.articleId,
      latestActivityDate: O.some(event.publishedAt),
      evaluationCount: 1,
      listMembershipCount: 1,
    }),
    (entry) => state.set(event.articleId.value, {
      ...entry,
      latestActivityDate: pipe(
        entry.latestActivityDate,
        O.map(mostRecentDate(event.publishedAt)),
      ),
      evaluationCount: entry.evaluationCount + 1,
    }),
  ),
);

type ConstructAllArticleActivityReadModel = (events: ReadonlyArray<DomainEvent>) => AllArticleActivityReadModel;

export const constructAllArticleActivityReadModel: ConstructAllArticleActivityReadModel = (events) => pipe(
  events,
  RA.filter(isEvaluationRecordedEvent),
  RA.reduce(new Map<string, ArticleActivity>(), addEventToActivities),
);
