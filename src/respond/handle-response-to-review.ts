import { DomainEvent, UserFoundReviewHelpfulEvent, UserRevokedFindingReviewHelpfulEvent } from '../types/domain-events';
import { ReviewId } from '../types/review-id';
import { User } from '../types/user';
import { UserId } from '../types/user-id';
import UserResponseToReview from '../types/user-response-to-review';

type HandleResponseToReview = (user: User, reviewId: ReviewId, command: 'respond-helpful'|'revoke-response') => Promise<void>;

export type GetAllEvents = () => Promise<ReadonlyArray<DomainEvent>>;
type GetUserResponseToReview = (userId: UserId, reviewId: ReviewId) => Promise<UserResponseToReview>;
export type CommitEvents = (events: ReadonlyArray<
UserFoundReviewHelpfulEvent|UserRevokedFindingReviewHelpfulEvent
>) => void;

export default (getAllEvents: GetAllEvents, commitEvents: CommitEvents): HandleResponseToReview => {
  const getUserResponseToReview: GetUserResponseToReview = async (userId, reviewId) => {
    const events = await getAllEvents();
    const priorEvents = events
      .filter((event): event is UserFoundReviewHelpfulEvent => event.type === 'UserFoundReviewHelpful')
      .filter((event) => event.reviewId.toString() === reviewId.toString() && event.userId === userId);

    return new UserResponseToReview(userId, reviewId, priorEvents.length === 0 ? 'no-response' : 'helpful');
  };

  return async (user, reviewId, command) => {
    const userResponseToReview = await getUserResponseToReview(user.id, reviewId);

    switch (command) {
      case 'respond-helpful':
        commitEvents(userResponseToReview.respondHelpful());
        break;
      case 'revoke-response':
        commitEvents(userResponseToReview.revokeResponse());
        break;
    }
  };
};
