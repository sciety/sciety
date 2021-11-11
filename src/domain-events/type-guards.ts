import { DomainEvent } from './domain-event';
import { GroupEvaluatedArticleEvent } from './group-evaluated-article-event';
import { UserCreatedAccountEvent } from './user-created-account-event';
import { UserFollowedEditorialCommunityEvent } from './user-followed-editorial-community-event';
import { UserFoundReviewHelpfulEvent } from './user-found-review-helpful-event';
import { UserFoundReviewNotHelpfulEvent } from './user-found-review-not-helpful-event';
import { UserRevokedFindingReviewHelpfulEvent } from './user-revoked-finding-review-helpful-event';
import { UserRevokedFindingReviewNotHelpfulEvent } from './user-revoked-finding-review-not-helpful-event';
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

export const isUserFoundReviewHelpfulEvent = (event: DomainEvent):
  event is UserFoundReviewHelpfulEvent => (
  event.type === 'UserFoundReviewHelpful'
);

export const isUserRevokedFindingReviewHelpfulEvent = (event: DomainEvent):
  event is UserRevokedFindingReviewHelpfulEvent => (
  event.type === 'UserRevokedFindingReviewHelpful'
);

export const isUserFoundReviewNotHelpfulEvent = (event: DomainEvent):
  event is UserFoundReviewNotHelpfulEvent => (
  event.type === 'UserFoundReviewNotHelpful'
);

export const isUserRevokedFindingReviewNotHelpfulEvent = (event: DomainEvent):
  event is UserRevokedFindingReviewNotHelpfulEvent => (
  event.type === 'UserRevokedFindingReviewNotHelpful'
);
