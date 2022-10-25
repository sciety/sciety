import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../domain-events';
import { ArticleActivity } from '../../types/article-activity';
import { GroupId } from '../../types/group-id';
import { ListId } from '../../types/list-id';

const mostRecentDate = (a: Date) => (b: Date) => (a.getTime() > b.getTime() ? a : b);

type ArticleState = ArticleActivity & {
  evaluatingGroups: Set<GroupId>,
  lists: Set<ListId>,
};

type AllArticleActivityReadModel = Map<string, ArticleState>;

const deleteFromSet = (set: Set<ListId>, element: ListId) => {
  set.delete(element);
  return set;
};

const addEventToActivities = (state: AllArticleActivityReadModel, event: DomainEvent) => {
  switch (event.type) {
    case 'ArticleAddedToList':
      return pipe(
        state.get(event.articleId.value),
        O.fromNullable,
        O.fold(
          () => state.set(event.articleId.value, {
            articleId: event.articleId,
            latestActivityDate: O.none,
            evaluationCount: 0,
            evaluatingGroups: new Set(),
            lists: new Set([event.listId]),
            listMembershipCount: 1,
          }),
          (entry) => state.set(event.articleId.value, {
            ...entry,
            lists: entry.lists.add(event.listId),
            listMembershipCount: entry.lists.add(event.listId).size,
          }),
        ),
      );

    case 'EvaluationRecorded':
      return pipe(
        state.get(event.articleId.value),
        O.fromNullable,
        O.fold(
          () => state.set(event.articleId.value, {
            articleId: event.articleId,
            latestActivityDate: O.some(event.publishedAt),
            evaluationCount: 1,
            evaluatingGroups: new Set([event.groupId]),
            lists: new Set(),
            listMembershipCount: 0,
          }),
          (entry) => state.set(event.articleId.value, {
            ...entry,
            latestActivityDate: pipe(
              entry.latestActivityDate,
              O.map(mostRecentDate(event.publishedAt)),
            ),
            evaluationCount: entry.evaluationCount + 1,
            evaluatingGroups: entry.evaluatingGroups.add(event.groupId),
          }),
        ),
      );

    case 'ArticleRemovedFromList':
      return pipe(
        state.get(event.articleId.value),
        O.fromNullable,
        O.fold(
          () => state,
          (entry) => state.set(event.articleId.value, {
            ...entry,
            lists: deleteFromSet(entry.lists, event.listId),
            listMembershipCount: deleteFromSet(entry.lists, event.listId).size,
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
