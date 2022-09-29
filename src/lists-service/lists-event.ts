import { ArticleAddedToListEvent, GroupJoinedEvent, ListCreatedEvent } from '../domain-events';

export type ListsEvent = ListCreatedEvent | ArticleAddedToListEvent | GroupJoinedEvent;
