import { UserFoundReviewHelpfulEvent } from '../types/domain-events';
import { generate } from '../types/event-id';
import { ReviewId } from '../types/review-id';
import toUserId from '../types/user-id';

type VoteCommand = (reviewId: ReviewId) => Promise<void>;
export type CommitEvents = (events: ReadonlyArray<UserFoundReviewHelpfulEvent>) => void;

export default (commitEvents: CommitEvents): VoteCommand => async (reviewId) => {
  commitEvents([
    {
      id: generate(),
      type: 'UserFoundReviewHelpful',
      date: new Date(),
      userId: toUserId('someuser'),
      reviewId,
    },
  ]);
};
