import { pipe } from 'fp-ts/function';
import { GroupEvaluatedMultipleArticlesCard, GroupEvaluatedSingleArticle } from './cards';
import { DomainEvent, EvaluationRecordedEvent } from '../domain-events';

type CollapsedGroupEvaluatedArticle = GroupEvaluatedSingleArticle & {
  type: 'CollapsedGroupEvaluatedArticle',
};

const mostRecentDate = (a: Date, b: Date) => (a.getTime() > b.getTime() ? a : b);

const collapsedGroupEvaluatedSingleArticle = (
  last: EvaluationRecordedEvent | CollapsedGroupEvaluatedArticle,
  publishedAt: Date,
): CollapsedGroupEvaluatedArticle => ({
  type: 'CollapsedGroupEvaluatedArticle',
  groupId: last.groupId,
  articleId: last.articleId,
  date: mostRecentDate(last.date, publishedAt),
});

type CollapsedGroupEvaluatedMultipleArticles = GroupEvaluatedMultipleArticlesCard & {
  type: 'CollapsedGroupEvaluatedMultipleArticles',
  articleIds: Set<string>,
};

export type CollapsedEvent = CollapsedGroupEvaluatedArticle | CollapsedGroupEvaluatedMultipleArticles;

type StateEntry = DomainEvent | CollapsedEvent;

const collapsedGroupEvaluatedMultipleArticles = (
  last: EvaluationRecordedEvent | CollapsedGroupEvaluatedArticle | CollapsedGroupEvaluatedMultipleArticles,
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

const isEvaluationRecordedEvent = (event: StateEntry):
  event is EvaluationRecordedEvent => (
  event.type === 'EvaluationRecorded'
);

const collapsesIntoPreviousEvent = (
  state: ReadonlyArray<StateEntry>, event: EvaluationRecordedEvent,
) => state.length && pipe(
  state[state.length - 1],
  (entry) => {
    if (
      isEvaluationRecordedEvent(entry)
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
  event: EvaluationRecordedEvent,
) => {
  const last = state.pop();
  if (!last) { return; }
  if (isEvaluationRecordedEvent(last)) {
    if (event.articleId.value === last.articleId.value) {
      state.push(collapsedGroupEvaluatedSingleArticle(last, event.publishedAt));
    } else {
      state.push(collapsedGroupEvaluatedMultipleArticles(last, new Set([last.articleId.value, event.articleId.value])));
    }
  } else if (isCollapsedGroupEvaluatedArticle(last)) {
    if (event.articleId.value === last.articleId.value) {
      state.push(collapsedGroupEvaluatedSingleArticle(last, event.publishedAt));
    } else {
      state.push(collapsedGroupEvaluatedMultipleArticles(last, new Set([last.articleId.value, event.articleId.value])));
    }
  } else if (isCollapsedGroupEvaluatedMultipleArticles(last)) {
    state.push(collapsedGroupEvaluatedMultipleArticles(last, last.articleIds.add(event.articleId.value)));
  }
};

const processEvent = (
  state: Array<StateEntry>, event: DomainEvent,
) => {
  if (isEvaluationRecordedEvent(event)) {
    if (collapsesIntoPreviousEvent(state, event)) {
      replaceWithCollapseEvent(state, event);
    } else {
      state.push({ ...event, date: event.publishedAt });
    }
  } else {
    state.push(event);
  }
  return state;
};

export const collapseCloseEvents = (
  events: ReadonlyArray<DomainEvent>,
): ReadonlyArray<StateEntry> => events.reduce(processEvent, []);
