import { ArticleAddedToListEvent } from './article-added-to-list-event';
import { DomainEvent } from './domain-event';
import { GroupCreatedEvent } from './group-created-event';
import { UserCreatedAccountEvent } from './user-created-account-event';
import { UserUnsavedArticleEvent } from './user-unsaved-article-event';

export const isArticleAddedToListEvent = (event: DomainEvent):
  event is ArticleAddedToListEvent => (
  event.type === 'ArticleAddedToList'
);

export const isGroupCreatedEvent = (event: DomainEvent):
  event is GroupCreatedEvent => (
  event.type === 'GroupCreated'
);

export const isUserUnsavedArticleEvent = (event: DomainEvent):
  event is UserUnsavedArticleEvent => (
  event.type === 'UserUnsavedArticle'
);

export const isUserCreatedAccountEvent = (event: DomainEvent):
  event is UserCreatedAccountEvent => (
  event.type === 'UserCreatedAccount'
);
