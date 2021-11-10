import { pipe } from 'fp-ts/function';
import { GroupEvaluatedArticleCard, GroupEvaluatedMultipleArticlesCard } from './cards';
import { GroupEvaluatedArticleEvent, UserFollowedEditorialCommunityEvent, UserSavedArticleEvent } from '../domain-events';

type CollapsedGroupEvaluatedArticle = GroupEvaluatedArticleCard & {
  type: 'CollapsedGroupEvaluatedArticle',
};

const collapsedGroupEvaluatedArticle = (
  last: GroupEvaluatedArticleEvent | CollapsedGroupEvaluatedArticle,
  evaluationCount: number,
): CollapsedGroupEvaluatedArticle => ({
  type: 'CollapsedGroupEvaluatedArticle',
  groupId: last.groupId,
  articleId: last.articleId,
  date: last.date,
  evaluationCount,
});

type CollapsedGroupEvaluatedMultipleArticles = GroupEvaluatedMultipleArticlesCard & {
  type: 'CollapsedGroupEvaluatedMultipleArticles',
  articleIds: Set<string>,
};

export type CollapsedEvent = CollapsedGroupEvaluatedArticle | CollapsedGroupEvaluatedMultipleArticles;

export type FeedRelevantEvent = (
  GroupEvaluatedArticleEvent
  | UserSavedArticleEvent
  | UserFollowedEditorialCommunityEvent
);

type StateEntry = FeedRelevantEvent | CollapsedEvent;

const collapsedGroupEvaluatedMultipleArticles = (
  last: GroupEvaluatedArticleEvent | CollapsedGroupEvaluatedArticle | CollapsedGroupEvaluatedMultipleArticles,
  articleIds: Set<string>,
): CollapsedGroupEvaluatedMultipleArticles => ({
  type: 'CollapsedGroupEvaluatedMultipleArticles',
  groupId: last.groupId,
  articleIds,
  articleCount: articleIds.size,
  date: last.date,
});

export const isCollapsedGroupEvaluatedArticle = (
  entry: StateEntry,
): entry is CollapsedGroupEvaluatedArticle => entry.type === 'CollapsedGroupEvaluatedArticle';

export const isCollapsedGroupEvaluatedMultipleArticles = (
  entry: StateEntry,
): entry is CollapsedGroupEvaluatedMultipleArticles => entry.type === 'CollapsedGroupEvaluatedMultipleArticles';

const isGroupEvaluatedArticleEvent = (event: StateEntry):
  event is GroupEvaluatedArticleEvent => (
  event.type === 'GroupEvaluatedArticle'
);

const collapsesIntoPreviousEvent = (
  state: ReadonlyArray<StateEntry>, event: GroupEvaluatedArticleEvent,
) => state.length && pipe(
  state[state.length - 1],
  (entry) => {
    if (
      isGroupEvaluatedArticleEvent(entry)
      || isCollapsedGroupEvaluatedArticle(entry)
      || isCollapsedGroupEvaluatedMultipleArticles(entry)
    ) {
      return entry.groupId === event.groupId;
    }
    return false;
  },
);

const replaceWithCollapseEvent = (
  state: Array<StateEntry>,
  event: GroupEvaluatedArticleEvent,
) => {
  const last = state.pop();
  if (!last) { return; }
  if (isGroupEvaluatedArticleEvent(last)) {
    if (event.articleId.value === last.articleId.value) {
      state.push(collapsedGroupEvaluatedArticle(last, 2));
    } else {
      state.push(collapsedGroupEvaluatedMultipleArticles(last, new Set([last.articleId.value, event.articleId.value])));
    }
  } else if (isCollapsedGroupEvaluatedArticle(last)) {
    if (event.articleId.value === last.articleId.value) {
      state.push(collapsedGroupEvaluatedArticle(last, last.evaluationCount + 1));
    } else {
      state.push(collapsedGroupEvaluatedMultipleArticles(last, new Set([last.articleId.value, event.articleId.value])));
    }
  } else if (isCollapsedGroupEvaluatedMultipleArticles(last)) {
    state.push(collapsedGroupEvaluatedMultipleArticles(last, last.articleIds.add(event.articleId.value)));
  }
};

const processEvent = (
  state: Array<StateEntry>, event: FeedRelevantEvent,
) => {
  if (isGroupEvaluatedArticleEvent(event)
    && collapsesIntoPreviousEvent(state, event)) {
    replaceWithCollapseEvent(state, event);
  } else {
    state.push(event);
  }
  return state;
};

export const collapseCloseEvents = (
  events: ReadonlyArray<FeedRelevantEvent>,
): ReadonlyArray<StateEntry> => events.reduce(processEvent, []);
