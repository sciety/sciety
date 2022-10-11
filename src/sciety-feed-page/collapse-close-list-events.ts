import { pipe } from 'fp-ts/function';
import { GroupEvaluatedMultipleArticlesCard } from './cards';
import {
  ArticleAddedToListEvent, DomainEvent, isArticleAddedToListEvent,
} from '../domain-events';
import { ListId } from '../types/list-id';

type CollapsedArticlesAddedToList = {
  type: 'CollapsedArticlesAddedToList',
  listId: ListId,
};

type CollapsedGroupEvaluatedMultipleArticles = GroupEvaluatedMultipleArticlesCard & {
  type: 'CollapsedGroupEvaluatedMultipleArticles',
  articleIds: Set<string>,
};

type CollapsedEvent = CollapsedArticlesAddedToList | CollapsedGroupEvaluatedMultipleArticles;

type StateEntry = DomainEvent | CollapsedEvent;

const isCollapsedArticlesAddedToList = (
  entry: StateEntry,
): entry is CollapsedArticlesAddedToList => entry.type === 'CollapsedArticlesAddedToList';

const collapsesIntoPreviousEvent = (
  state: ReadonlyArray<StateEntry>, event: ArticleAddedToListEvent,
) => state.length && pipe(
  state[state.length - 1],
  (entry) => {
    if (
      isArticleAddedToListEvent(entry)
      || isCollapsedArticlesAddedToList(entry)
    ) {
      return entry.listId === event.listId;
    }
    return false;
  },
);

const calculateNextStateEntry = (
  current: StateEntry,
  event: ArticleAddedToListEvent,
) => event;

const replaceWithCollapseEvent = (
  state: Array<StateEntry>,
  event: ArticleAddedToListEvent,
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
  if (isArticleAddedToListEvent(event)) {
    if (collapsesIntoPreviousEvent(state, event)) {
      replaceWithCollapseEvent(state, event);
    } else {
      state.push(event);
    }
  } else {
    state.push(event);
  }
  return state;
};

// ts-unused-exports:disable-next-line
export const collapseCloseListEvents = (
  events: ReadonlyArray<DomainEvent>,
): ReadonlyArray<StateEntry> => events.reduce(processEvent, []);
