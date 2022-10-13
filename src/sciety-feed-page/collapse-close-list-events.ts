import { pipe } from 'fp-ts/function';
import { CollapsedArticlesAddedToList, StateEntry } from './collapse-close-events';
import {
  ArticleAddedToListEvent, isArticleAddedToListEvent,
} from '../domain-events';

export const isCollapsedArticlesAddedToList = (
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
  entriesSoFar: Array<StateEntry>,
  event: ArticleAddedToListEvent,
) => {
  const mostRecentEntry = entriesSoFar.pop();
  if (!mostRecentEntry) { return; }
  if (isArticleAddedToListEvent(mostRecentEntry)) {
    entriesSoFar.push({
      type: 'CollapsedArticlesAddedToList',
      listId: event.listId,
      date: event.date,
      articleCount: 2,
    });
  } else if (isCollapsedArticlesAddedToList(mostRecentEntry)) {
    entriesSoFar.push({
      type: 'CollapsedArticlesAddedToList',
      listId: event.listId,
      date: event.date,
      articleCount: mostRecentEntry.articleCount + 1,
    });
  }
};

const processEvent = (
  state: Array<StateEntry>, event: StateEntry,
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
  events: ReadonlyArray<StateEntry>,
): ReadonlyArray<StateEntry> => events.reduce(processEvent, []);
