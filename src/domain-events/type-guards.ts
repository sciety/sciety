import { DomainEvent } from './domain-event';
import { EditorialCommunityReviewedArticleEvent } from './editorial-community-reviewed-article-event';
import { UserFollowedEditorialCommunityEvent } from './user-followed-editorial-community-event';
import { UserSavedArticleEvent } from './user-saved-article-event';
import { UserUnfollowedEditorialCommunityEvent } from './user-unfollowed-editorial-community-event';
import { UserUnsavedArticleEvent } from './user-unsaved-article-event';

export const isEditorialCommunityReviewedArticleEvent = (event: DomainEvent):
  event is EditorialCommunityReviewedArticleEvent => (
  event.type === 'EditorialCommunityReviewedArticle'
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
