import { DomainEvent, UserFoundReviewHelpfulEvent } from '../types/domain-events';
import { generate } from '../types/event-id';
import { ReviewId } from '../types/review-id';
import { User } from '../types/user';

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
    commitEvents([
      {
        id: generate(),
        type: 'UserFoundReviewHelpful',
        date: new Date(),
        userId: user.id,
        reviewId,
      },
    ]);
  }
);
