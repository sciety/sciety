import { ArticleAddedToListEvent } from './article-added-to-list-event';
import { DomainEvent } from './domain-event';
import { EvaluationRecordedEvent } from './evaluation-recorded-event';
import { GroupCreatedEvent } from './group-created-event';
import { ListCreatedEvent } from './list-created-event';
import { UserCreatedAccountEvent } from './user-created-account-event';
import { UserFollowedEditorialCommunityEvent } from './user-followed-editorial-community-event';
import { UserUnfollowedEditorialCommunityEvent } from './user-unfollowed-editorial-community-event';
import { UserUnsavedArticleEvent } from './user-unsaved-article-event';

export const isArticleAddedToListEvent = (event: DomainEvent):
  event is ArticleAddedToListEvent => (
  event.type === 'ArticleAddedToList'
);

export const isGroupCreatedEvent = (event: DomainEvent):
  event is GroupCreatedEvent => (
  event.type === 'GroupCreated'
);

export const isEvaluationRecordedEvent = (event: DomainEvent):
  event is EvaluationRecordedEvent => (
  event.type === 'EvaluationRecorded'
);

export const isListCreatedEvent = (event: DomainEvent):
event is ListCreatedEvent => (
  event.type === 'ListCreated'
);

export const isUserFollowedEditorialCommunityEvent = (event: DomainEvent):
  event is UserFollowedEditorialCommunityEvent => (
  event.type === 'UserFollowedEditorialCommunity'
);

export const isUserUnfollowedEditorialCommunityEvent = (event: DomainEvent):
  event is UserUnfollowedEditorialCommunityEvent => (
  event.type === 'UserUnfollowedEditorialCommunity'
);

export const isUserUnsavedArticleEvent = (event: DomainEvent):
  event is UserUnsavedArticleEvent => (
  event.type === 'UserUnsavedArticle'
);

export const isUserCreatedAccountEvent = (event: DomainEvent):
  event is UserCreatedAccountEvent => (
  event.type === 'UserCreatedAccount'
);
