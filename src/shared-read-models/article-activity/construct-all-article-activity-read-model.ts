import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../domain-events';
import { ArticleActivity } from '../../types/article-activity';
import { GroupId } from '../../types/group-id';

const mostRecentDate = (a: Date) => (b: Date) => (a.getTime() > b.getTime() ? a : b);

type ArticleState = ArticleActivity & { evaluatingGroups: Set<GroupId> };

type AllArticleActivityReadModel = Map<string, ArticleState>;

const addEventToActivities = (state: AllArticleActivityReadModel, event: DomainEvent) => {
  switch (event.type) {
    case 'EvaluationRecorded':
      return pipe(
        state.get(event.articleId.value),
        O.fromNullable,
        O.fold(
          () => state.set(event.articleId.value, {
            doi: event.articleId,
            latestActivityDate: O.some(event.publishedAt),
            evaluationCount: 1,
            evaluatingGroups: new Set([event.groupId]),
            listMembershipCount: 1,
          }),
          (entry) => state.set(event.articleId.value, {
            ...entry,
            latestActivityDate: pipe(
              entry.latestActivityDate,
              O.map(mostRecentDate(event.publishedAt)),
            ),
            evaluationCount: entry.evaluationCount + 1,
            evaluatingGroups: entry.evaluatingGroups.add(event.groupId),
            listMembershipCount: entry.evaluatingGroups.add(event.groupId).size,
          }),
        ),
      );

    case 'UserSavedArticle':
      return pipe(
        state.get(event.articleId.value),
        O.fromNullable,
        O.fold(
          () => state.set(event.articleId.value, {
            doi: event.articleId,
            latestActivityDate: O.none,
            evaluationCount: 0,
            evaluatingGroups: new Set(),
            listMembershipCount: 1,
          }),
          (entry) => state.set(event.articleId.value, {
            ...entry,
            listMembershipCount: entry.listMembershipCount + 1,
          }),
        ),
      );

    default:
      return state;
  }
};

type ConstructAllArticleActivityReadModel = (events: ReadonlyArray<DomainEvent>) => AllArticleActivityReadModel;

export const constructAllArticleActivityReadModel: ConstructAllArticleActivityReadModel = (events) => pipe(
  events,
  RA.reduce(new Map<string, ArticleState>(), addEventToActivities),
);
