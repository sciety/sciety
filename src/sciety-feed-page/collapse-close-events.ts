import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { match } from 'ts-pattern';
import { CollapsedGroupEvaluatedArticle, CollapsedGroupEvaluatedMultipleArticles, EventCardModel } from './event-card';
import { GroupEvaluatedArticleEvent, UserFollowedEditorialCommunityEvent, UserSavedArticleEvent } from '../domain-events';

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

type CollapsedGroupEvaluatedMultipleArticlesState = (
  CollapsedGroupEvaluatedMultipleArticles
  & { articleIds: Set<string> }
);

type StateEntry = FeedRelevantEvent | CollapsedGroupEvaluatedArticle | CollapsedGroupEvaluatedMultipleArticlesState;

const collapsedGroupEvaluatedMultipleArticles = (
  last: GroupEvaluatedArticleEvent | CollapsedGroupEvaluatedArticle | CollapsedGroupEvaluatedMultipleArticlesState,
  articleIds: Set<string>,
): CollapsedGroupEvaluatedMultipleArticlesState => ({
  type: 'CollapsedGroupEvaluatedMultipleArticles',
  groupId: last.groupId,
  articleIds,
  articleCount: articleIds.size,
  date: last.date,
});

const isCollapsedGroupEvaluatedArticle = (
  entry: StateEntry,
): entry is CollapsedGroupEvaluatedArticle => entry.type === 'CollapsedGroupEvaluatedArticle';

const isCollapsedGroupEvaluatedMultipleArticlesState = (
  entry: StateEntry,
): entry is CollapsedGroupEvaluatedMultipleArticlesState => entry.type === 'CollapsedGroupEvaluatedMultipleArticles';

const isGroupEvaluatedArticleEvent = (event: StateEntry):
  event is GroupEvaluatedArticleEvent => (
  event.type === 'GroupEvaluatedArticle'
);

const collapsesIntoPreviousEvent = (
  state: ReadonlyArray<StateEntry>, event: GroupEvaluatedArticleEvent,
) => pipe(
  state,
  RA.last,
  O.fold(
    () => false,
    (previousEvent) => match(previousEvent)
      .with({ type: 'GroupEvaluatedArticle', groupId: event.groupId }, () => true)
      .with({ type: 'CollapsedGroupEvaluatedArticle', groupId: event.groupId }, () => true)
      .with({ type: 'CollapsedGroupEvaluatedMultipleArticles', groupId: event.groupId }, () => true)
      .otherwise(() => false),
  ),
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
  } else if (isCollapsedGroupEvaluatedMultipleArticlesState(last)) {
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

export type FeedRelevantEvent =
  UserSavedArticleEvent | UserFollowedEditorialCommunityEvent | GroupEvaluatedArticleEvent;

export const collapseCloseEvents = (
  events: ReadonlyArray<FeedRelevantEvent>,
): ReadonlyArray<EventCardModel> => events.reduce(processEvent, []);
