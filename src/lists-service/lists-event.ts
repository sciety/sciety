import { ArticleAddedToListEvent, ListCreatedEvent } from '../domain-events';

export type ListsEvent = ListCreatedEvent | ArticleAddedToListEvent;
