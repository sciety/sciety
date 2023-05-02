/* eslint-disable no-param-reassign */
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { GroupId } from '../../types/group-id';
import { ListId } from '../../types/list-id';
import { DomainEvent } from '../../domain-events';
import { Doi } from '../../types/doi';
import { ReviewId } from '../../types/review-id';

type ArticleState = {
  articleId: Doi,
  latestActivityDate: O.Option<Date>,
  evaluationLocators: Array<ReviewId>,
  evaluationCount: number,
  listMembershipCount: number,
  evaluatingGroups: Set<GroupId>,
  lists: Set<ListId>,
};

const mostRecentDate = (a: Date) => (b: Date) => (a.getTime() > b.getTime() ? a : b);

const deleteFromSet = (set: Set<ListId>, element: ListId) => {
  set.delete(element);
  return set;
};

export type ReadModel = Map<string, ArticleState>;

export const initialState = (): ReadModel => new Map();

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  switch (event.type) {
    case 'ArticleAddedToList':
      return pipe(
        readmodel.get(event.articleId.value),
        O.fromNullable,
        O.fold(
          () => readmodel.set(event.articleId.value, {
            articleId: event.articleId,
            latestActivityDate: O.none,
            evaluationLocators: [],
            evaluationCount: 0,
            evaluatingGroups: new Set(),
            lists: new Set([event.listId]),
            listMembershipCount: 1,
          }),
          (entry) => readmodel.set(event.articleId.value, {
            ...entry,
            lists: entry.lists.add(event.listId),
            listMembershipCount: entry.lists.add(event.listId).size,
          }),
        ),
      );

    case 'EvaluationRecorded':
      return pipe(
        readmodel.get(event.articleId.value),
        O.fromNullable,
        O.fold(
          () => readmodel.set(event.articleId.value, {
            articleId: event.articleId,
            latestActivityDate: O.some(event.publishedAt),
            evaluationLocators: [event.evaluationLocator],
            evaluationCount: 1,
            evaluatingGroups: new Set([event.groupId]),
            lists: new Set(),
            listMembershipCount: 0,
          }),
          (entry) => readmodel.set(event.articleId.value, {
            ...entry,
            latestActivityDate: pipe(
              entry.latestActivityDate,
              O.map(mostRecentDate(event.publishedAt)),
            ),
            evaluationLocators: [...entry.evaluationLocators, event.evaluationLocator],
            evaluationCount: entry.evaluationCount + 1,
            evaluatingGroups: entry.evaluatingGroups.add(event.groupId),
          }),
        ),
      );

    case 'ArticleRemovedFromList':
      return pipe(
        readmodel.get(event.articleId.value),
        O.fromNullable,
        O.fold(
          () => readmodel,
          (entry) => readmodel.set(event.articleId.value, {
            ...entry,
            lists: deleteFromSet(entry.lists, event.listId),
            listMembershipCount: deleteFromSet(entry.lists, event.listId).size,
          }),
        ),
      );

    default:
      return readmodel;
  }
};
