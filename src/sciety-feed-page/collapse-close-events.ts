import { pipe } from 'fp-ts/function';
import { GroupEvaluatedMultipleArticlesCard, GroupEvaluatedSingleArticle } from './cards';
import { DomainEvent, EvaluationRecordedEvent } from '../domain-events';

type CollapsedGroupEvaluatedArticle = GroupEvaluatedSingleArticle & {
  type: 'CollapsedGroupEvaluatedArticle',
};

const collapsedGroupEvaluatedArticle = (
  last: EvaluationRecordedEvent | CollapsedGroupEvaluatedArticle,
): CollapsedGroupEvaluatedArticle => ({
  type: 'CollapsedGroupEvaluatedArticle',
  groupId: last.groupId,
  articleId: last.articleId,
  date: last.date,
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
      state.push(collapsedGroupEvaluatedArticle(last));
    } else {
      state.push(collapsedGroupEvaluatedMultipleArticles(last, new Set([last.articleId.value, event.articleId.value])));
    }
  } else if (isCollapsedGroupEvaluatedArticle(last)) {
    if (event.articleId.value === last.articleId.value) {
      state.push(collapsedGroupEvaluatedArticle(last));
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
  if (isEvaluationRecordedEvent(event)
    && collapsesIntoPreviousEvent(state, event)) {
    replaceWithCollapseEvent(state, event);
  } else {
    state.push(event);
  }
  return state;
};

export const collapseCloseEvents = (
  events: ReadonlyArray<DomainEvent>,
): ReadonlyArray<StateEntry> => events.reduce(processEvent, []);
