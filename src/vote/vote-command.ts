import { DomainEvent, UserFoundReviewHelpfulEvent } from '../types/domain-events';
import { generate } from '../types/event-id';
import { ReviewId } from '../types/review-id';
import { User } from '../types/user';

type VoteCommand = (user: User, reviewId: ReviewId) => Promise<void>;

export type GetAllEvents = () => Promise<ReadonlyArray<DomainEvent>>;
export type CommitEvents = (events: ReadonlyArray<UserFoundReviewHelpfulEvent>) => void;

export default (getAllEvents: GetAllEvents, commitEvents: CommitEvents): VoteCommand => (
  async (user, reviewId) => {
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
