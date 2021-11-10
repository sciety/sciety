import { DomainEvent } from './domain-event';
import { GroupEvaluatedArticleEvent } from './group-evaluated-article-event';
import { UserCreatedAccountEvent } from './user-created-account-event';
import { UserFollowedEditorialCommunityEvent } from './user-followed-editorial-community-event';
import { UserSavedArticleEvent } from './user-saved-article-event';
import { UserUnfollowedEditorialCommunityEvent } from './user-unfollowed-editorial-community-event';
import { UserUnsavedArticleEvent } from './user-unsaved-article-event';

export const isGroupEvaluatedArticleEvent = (event: DomainEvent):
  event is GroupEvaluatedArticleEvent => (
  event.type === 'GroupEvaluatedArticle'
);
export const isUserFollowedEditorialCommunityEvent = (event: DomainEvent):
  event is UserFollowedEditorialCommunityEvent => (
  event.type === 'UserFollowedEditorialCommunity'
);
export const isUserSavedArticleEvent = (event: DomainEvent):
  event is UserSavedArticleEvent => (
  event.type === 'UserSavedArticle'
); export const isUserUnfollowedEditorialCommunityEvent = (event: DomainEvent):
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
