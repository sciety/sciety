import { pipe } from 'fp-ts/function';
import { DomainEvent, GroupEvaluatedArticleEvent } from '../domain-events';
import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';

type CollapsedGroupEvaluatedArticle = {
  type: 'CollapsedGroupEvaluatedArticle',
  groupId: GroupId,
  articleId: Doi,
  evaluationCount: number,
  date: Date,
};

type CollapsedGroupEvaluatedMultipleArticles = {
  type: 'CollapsedGroupEvaluatedMultipleArticles',
  groupId: GroupId,
  articleIds: ReadonlySet<string>,
  date: Date,
};

type StateEntry = DomainEvent | CollapsedGroupEvaluatedArticle | CollapsedGroupEvaluatedMultipleArticles;

const isCollapsedGroupEvaluatedArticle = (
  entry: StateEntry,
): entry is CollapsedGroupEvaluatedArticle => entry.type === 'CollapsedGroupEvaluatedArticle';

const isCollapsedGroupEvaluatedMultipleArticles = (
  entry: StateEntry,
): entry is CollapsedGroupEvaluatedMultipleArticles => entry.type === 'CollapsedGroupEvaluatedMultipleArticles';

const isEditorialCommunityReviewedArticleEvent = (event: StateEntry):
  event is GroupEvaluatedArticleEvent => (
  event.type === 'GroupEvaluatedArticle'
);

const collapsesIntoPreviousEvent = (
  state: ReadonlyArray<StateEntry>, event: GroupEvaluatedArticleEvent,
) => state.length && pipe(
  state[state.length - 1],
  (entry) => {
    if (isEditorialCommunityReviewedArticleEvent(entry)) {
      return entry.groupId === event.groupId;
    }
    if (isCollapsedGroupEvaluatedArticle(entry)) {
      return entry.groupId === event.groupId;
    }
    if (isCollapsedGroupEvaluatedMultipleArticles(entry)) {
      return entry.groupId === event.groupId;
    }
    return false;
  },
);

const replaceWithCollapseEvent = (
  state: Array<StateEntry>,
  event: GroupEvaluatedArticleEvent,
) => {
  const last = state[state.length - 1];
  const head = state.slice(0, -1);
  if (isEditorialCommunityReviewedArticleEvent(last)) {
    if (event.articleId.value === last.articleId.value) {
      return [...head, {
        type: 'CollapsedGroupEvaluatedArticle' as const,
        articleId: last.articleId,
        groupId: last.groupId,
        evaluationCount: 2,
        date: last.date,
      }];
    }
    return [...head, {
      type: 'CollapsedGroupEvaluatedMultipleArticles' as const,
      groupId: last.groupId,
      articleIds: new Set([last.articleId.value, event.articleId.value]),
      date: last.date,
    }];
  }

  if (isCollapsedGroupEvaluatedArticle(last)) {
    if (event.articleId.value === last.articleId.value) {
      return [...head, {
        ...last,
        evaluationCount: last.evaluationCount + 1,
      }];
    }
    return [...head, {
      type: 'CollapsedGroupEvaluatedMultipleArticles' as const,
      groupId: last.groupId,
      articleIds: new Set([last.articleId.value, event.articleId.value]),
      date: last.date,
    }];
  }

  if (isCollapsedGroupEvaluatedMultipleArticles(last)) {
    return [...head, {
      ...last,
      articleIds: new Set([...last.articleIds, event.articleId.value]),
    }];
  }

  return state;
};

const processEvent = (
  state: Array<StateEntry>, event: DomainEvent,
) => {
  if (isEditorialCommunityReviewedArticleEvent(event)
    && collapsesIntoPreviousEvent(state, event)) {
    return replaceWithCollapseEvent(state, event);
  }
  state.push(event);
  return state;
};

export const collapseCloseEvents = (
  events: ReadonlyArray<DomainEvent>,
): Array<StateEntry> => events.reduce(processEvent, []);
