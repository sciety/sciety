import { DomainEvent, UserFoundReviewHelpfulEvent } from '../types/domain-events';
import { ReviewId } from '../types/review-id';
import { User } from '../types/user';
import UserResponseToReview from '../types/user-response-to-review';

type VoteCommand = (user: User, reviewId: ReviewId) => Promise<void>;

export type GetAllEvents = () => Promise<ReadonlyArray<DomainEvent>>;
export type CommitEvents = (events: ReadonlyArray<UserFoundReviewHelpfulEvent>) => void;

export default (getAllEvents: GetAllEvents, commitEvents: CommitEvents): VoteCommand => (
  async (user, reviewId) => {
    const events = await getAllEvents();
    const alreadyVoted = events
      .filter((event): event is UserFoundReviewHelpfulEvent => event.type === 'UserFoundReviewHelpful')
      .some((event) => event.reviewId.toString() === reviewId.toString() && event.userId === user.id);

    if (alreadyVoted) {
      return;
    }
    const userResponseToReview = new UserResponseToReview(user.id, reviewId);
    commitEvents(userResponseToReview.respondHelpful());
  }
);
