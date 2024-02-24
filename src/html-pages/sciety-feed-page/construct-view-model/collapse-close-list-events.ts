import { pipe } from 'fp-ts/function';
import { FeedItem, isArticleAddedToListEvent, isCollapsedArticlesAddedToList } from './feed-item.js';
import { DomainEvent, EventOfType, isEventOfType } from '../../../domain-events/index.js';

const collapsesIntoPreviousEvent = (
  state: ReadonlyArray<FeedItem>, event: EventOfType<'ArticleAddedToList'>,
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
  entriesSoFar: Array<FeedItem>,
  event: EventOfType<'ArticleAddedToList'>,
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
  state: Array<FeedItem>, event: DomainEvent,
) => {
  if (isEventOfType('ArticleAddedToList')(event)) {
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

export const collapseCloseListEvents = (
  events: ReadonlyArray<DomainEvent>,
): ReadonlyArray<FeedItem> => events.reduce(processEvent, []);
