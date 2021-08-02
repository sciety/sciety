import { UserFollowedEditorialCommunityEvent } from './user-followed-editorial-community-event';
import { UserFoundReviewHelpfulEvent } from './user-found-review-helpful-event';
import { UserFoundReviewNotHelpfulEvent } from './user-found-review-not-helpful-event';
import { UserRevokedFindingReviewHelpfulEvent } from './user-revoked-finding-review-helpful-event';
import { UserRevokedFindingReviewNotHelpfulEvent } from './user-revoked-finding-review-not-helpful-event';
import { UserSavedArticleEvent } from './user-saved-article-event';
import { UserUnfollowedEditorialCommunityEvent } from './user-unfollowed-editorial-community-event';
import { UserUnsavedArticleEvent } from './user-unsaved-article-event';

export type RuntimeGeneratedEvent =
  UserUnsavedArticleEvent |
  UserFollowedEditorialCommunityEvent |
  UserUnfollowedEditorialCommunityEvent |
  UserFoundReviewHelpfulEvent |
  UserRevokedFindingReviewHelpfulEvent |
  UserFoundReviewNotHelpfulEvent |
  UserRevokedFindingReviewNotHelpfulEvent |
  UserSavedArticleEvent;
