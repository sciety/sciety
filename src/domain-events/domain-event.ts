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

export type DomainEvent =
  GroupEvaluatedArticleEvent |
  UserSavedArticleEvent |
  UserUnsavedArticleEvent |
  UserFollowedEditorialCommunityEvent |
  UserUnfollowedEditorialCommunityEvent |
  UserFoundReviewHelpfulEvent |
  UserRevokedFindingReviewHelpfulEvent |
  UserFoundReviewNotHelpfulEvent |
  UserRevokedFindingReviewNotHelpfulEvent |
  UserCreatedAccountEvent;
