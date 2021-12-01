import { pipe } from 'fp-ts/function';
import { GroupEvaluatedMultipleArticlesCard, GroupEvaluatedSingleArticle } from './cards';
import { DomainEvent, EvaluationRecordedEvent } from '../domain-events';

type CollapsedGroupEvaluatedSingleArticle = GroupEvaluatedSingleArticle & {
  type: 'CollapsedGroupEvaluatedArticle',
};

const mostRecentDate = (a: Date, b: Date) => (a.getTime() > b.getTime() ? a : b);

const collapsedGroupEvaluatedSingleArticle = (
  last: EvaluationRecordedEvent | CollapsedGroupEvaluatedSingleArticle,
  publishedAt: Date,
): CollapsedGroupEvaluatedSingleArticle => ({
  type: 'CollapsedGroupEvaluatedArticle',
  groupId: last.groupId,
  articleId: last.articleId,
  date: mostRecentDate(last.date, publishedAt),
});

type CollapsedGroupEvaluatedMultipleArticles = GroupEvaluatedMultipleArticlesCard & {
  type: 'CollapsedGroupEvaluatedMultipleArticles',
  articleIds: Set<string>,
};

export type CollapsedEvent = CollapsedGroupEvaluatedSingleArticle | CollapsedGroupEvaluatedMultipleArticles;

type StateEntry = DomainEvent | CollapsedEvent;

const collapsedGroupEvaluatedMultipleArticles = (
  last: EvaluationRecordedEvent | CollapsedGroupEvaluatedSingleArticle | CollapsedGroupEvaluatedMultipleArticles,
  articleIds: Set<string>,
  publishedAt: Date,
): CollapsedGroupEvaluatedMultipleArticles => ({
  type: 'CollapsedGroupEvaluatedMultipleArticles',
  groupId: last.groupId,
  articleIds,
  articleCount: articleIds.size,
  date: mostRecentDate(last.date, publishedAt),
});

export const isCollapsedGroupEvaluatedArticle = (
  entry: StateEntry,
): entry is CollapsedGroupEvaluatedSingleArticle => entry.type === 'CollapsedGroupEvaluatedArticle';

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

const calculateNextStateEntry = (
  current: StateEntry,
  event: EvaluationRecordedEvent,
) => {
  if (isEvaluationRecordedEvent(current)) {
    if (event.articleId.value === current.articleId.value) {
      return collapsedGroupEvaluatedSingleArticle(current, event.publishedAt);
    }
    return collapsedGroupEvaluatedMultipleArticles(
      current,
      new Set([current.articleId.value, event.articleId.value]),
      event.publishedAt,
    );
  } if (isCollapsedGroupEvaluatedArticle(current)) {
    if (event.articleId.value === current.articleId.value) {
      return collapsedGroupEvaluatedSingleArticle(current, event.publishedAt);
    }
    return collapsedGroupEvaluatedMultipleArticles(
      current,
      new Set([current.articleId.value, event.articleId.value]),
      event.publishedAt,
    );
  } if (isCollapsedGroupEvaluatedMultipleArticles(current)) {
    return collapsedGroupEvaluatedMultipleArticles(
      current,
      current.articleIds.add(event.articleId.value),
      event.publishedAt,
    );
  }
};

const replaceWithCollapseEvent = (
  state: Array<StateEntry>,
  event: EvaluationRecordedEvent,
) => {
  const current = state.pop();
  if (!current) { return; }
  const next = calculateNextStateEntry(current, event);
  if (next) {
    state.push(next);
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
