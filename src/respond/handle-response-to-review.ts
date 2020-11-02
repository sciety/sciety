import { DomainEvent, UserFoundReviewHelpfulEvent, UserRevokedFindingReviewHelpfulEvent } from '../types/domain-events';
import { ReviewId } from '../types/review-id';
import { User } from '../types/user';
import UserResponseToReview from '../types/user-response-to-review';

type HandleResponseToReview = (user: User, reviewId: ReviewId, command: 'respond-helpful'|'revoke-response') => Promise<void>;

export type GetAllEvents = () => Promise<ReadonlyArray<DomainEvent>>;
export type CommitEvents = (events: ReadonlyArray<
UserFoundReviewHelpfulEvent|UserRevokedFindingReviewHelpfulEvent
>) => void;

export default (getAllEvents: GetAllEvents, commitEvents: CommitEvents): HandleResponseToReview => (
  async (user, reviewId, command) => {
    const events = await getAllEvents();
    const priorEvents = events
      .filter((event): event is UserFoundReviewHelpfulEvent => event.type === 'UserFoundReviewHelpful')
      .filter((event) => event.reviewId.toString() === reviewId.toString() && event.userId === user.id);

    const userResponseToReview = new UserResponseToReview(user.id, reviewId,
      priorEvents.length === 0 ? 'no-response' : 'helpful');
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
