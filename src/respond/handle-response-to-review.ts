import { UserFoundReviewHelpfulEvent, UserRevokedFindingReviewHelpfulEvent } from '../types/domain-events';
import { ReviewId } from '../types/review-id';
import { User } from '../types/user';
import { UserId } from '../types/user-id';
import UserResponseToReview from '../types/user-response-to-review';

type HandleResponseToReview = (user: User, reviewId: ReviewId, command: 'respond-helpful'|'revoke-response') => Promise<void>;

type GetUserResponseToReview = (userId: UserId, reviewId: ReviewId) => Promise<UserResponseToReview>;

export type CommitEvents = (events: ReadonlyArray<
UserFoundReviewHelpfulEvent|UserRevokedFindingReviewHelpfulEvent
>) => void;

export default (
  getUserResponseToReview: GetUserResponseToReview,
  commitEvents: CommitEvents,
): HandleResponseToReview => (
  async (user, reviewId, command) => {
    const userResponseToReview = await getUserResponseToReview(user.id, reviewId);

    switch (command) {
      case 'respond-helpful':
        commitEvents(userResponseToReview.respondHelpful());
        break;
      case 'revoke-response':
        commitEvents(userResponseToReview.revokeResponse());
        break;
    }
  }
);
