import { pipe } from 'fp-ts/function';
import { GroupEvaluatedMultipleArticlesCard } from './cards';
import {
  ArticleAddedToListEvent, DomainEvent, isArticleAddedToListEvent,
} from '../domain-events';
import { ListId } from '../types/list-id';

type CollapsedArticlesAddedToList = {
  type: 'CollapsedArticlesAddedToList',
  listId: ListId,
  date: Date,
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

const replaceWithCollapseEvent = (
  state: Array<StateEntry>,
  event: ArticleAddedToListEvent,
) => {
  const current = state.pop();
  if (!current) { return; }
  state.push({
    type: 'CollapsedArticlesAddedToList',
    listId: event.listId,
    date: event.date,
  });
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
