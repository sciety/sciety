import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../domain-events';
import { ArticleActivity } from '../../types/article-activity';
import { GroupId } from '../../types/group-id';
import { ListId } from '../../types/list-id';
import { UserId } from '../../types/user-id';

const mostRecentDate = (a: Date) => (b: Date) => (a.getTime() > b.getTime() ? a : b);

type ArticleState = ArticleActivity & {
  evaluatingGroups: Set<GroupId>,
  savingUsers: Set<UserId>,
  lists: Set<ListId>,
};

type AllArticleActivityReadModel = Map<string, ArticleState>;

const deleteFromSet = (set: Set<UserId>, element: UserId) => {
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
            savingUsers: new Set(),
            lists: new Set([event.listId]),
            listMembershipCount: 1,
          }),
          (entry) => state.set(event.articleId.value, {
            ...entry,
            lists: entry.lists.add(event.listId),
            listMembershipCount: entry.savingUsers.size
              + entry.lists.add(event.listId).size,
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
            savingUsers: new Set(),
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

    case 'UserSavedArticle':
      return pipe(
        state.get(event.articleId.value),
        O.fromNullable,
        O.fold(
          () => state.set(event.articleId.value, {
            articleId: event.articleId,
            latestActivityDate: O.none,
            evaluationCount: 0,
            evaluatingGroups: new Set(),
            savingUsers: new Set([event.userId]),
            lists: new Set(),
            listMembershipCount: 1,
          }),
          (entry) => state.set(event.articleId.value, {
            ...entry,
            savingUsers: entry.savingUsers.add(event.userId),
            listMembershipCount: entry.savingUsers.add(event.userId).size
              + entry.lists.size,
          }),
        ),
      );

    case 'UserUnsavedArticle':
      return pipe(
        state.get(event.articleId.value),
        O.fromNullable,
        O.fold(
          () => state,
          (entry) => state.set(event.articleId.value, {
            ...entry,
            savingUsers: deleteFromSet(entry.savingUsers, event.userId),
            listMembershipCount: deleteFromSet(entry.savingUsers, event.userId).size
              + entry.lists.size,
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
