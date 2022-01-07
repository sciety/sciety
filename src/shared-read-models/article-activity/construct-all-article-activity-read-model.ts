import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../domain-events';
import { lists } from '../../ncrc-featured-articles-page/lists';
import { ArticleActivity } from '../../types/article-activity';
import { Doi } from '../../types/doi';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

const mostRecentDate = (a: Date) => (b: Date) => (a.getTime() > b.getTime() ? a : b);

type ArticleState = ArticleActivity & {
  evaluatingGroups: Set<GroupId>,
  savingUsers: Set<UserId>,
};

type AllArticleActivityReadModel = Map<string, ArticleState>;

const deleteFromSet = (set: Set<UserId>, element: UserId) => {
  set.delete(element);
  return set;
};

const membershipInFeaturedLists = (articleId: Doi) => pipe(
  lists,
  R.filter((list) => pipe(
    list,
    RA.map((doi) => doi.value),
    (values) => values.includes(articleId.value),
  )),
  R.size,
);

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
            savingUsers: new Set(),
            listMembershipCount: 1 + membershipInFeaturedLists(event.articleId),
          }),
          (entry) => state.set(event.articleId.value, {
            ...entry,
            latestActivityDate: pipe(
              entry.latestActivityDate,
              O.map(mostRecentDate(event.publishedAt)),
            ),
            evaluationCount: entry.evaluationCount + 1,
            evaluatingGroups: entry.evaluatingGroups.add(event.groupId),
            listMembershipCount: entry.evaluatingGroups.add(event.groupId).size + entry.savingUsers.size,
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
            savingUsers: new Set([event.userId]),
            listMembershipCount: 1,
          }),
          (entry) => state.set(event.articleId.value, {
            ...entry,
            savingUsers: entry.savingUsers.add(event.userId),
            listMembershipCount: entry.savingUsers.add(event.userId).size + entry.evaluatingGroups.size,
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
            listMembershipCount: deleteFromSet(entry.savingUsers, event.userId).size + entry.evaluatingGroups.size,
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
