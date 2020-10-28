import Doi from '../types/doi';
import { UserFoundReviewHelpfulEvent } from '../types/domain-events';
import { generate } from '../types/event-id';
import toUserId from '../types/user-id';

type VoteCommand = () => Promise<void>;
export type CommitEvents = (events: ReadonlyArray<UserFoundReviewHelpfulEvent>) => void;

export default (commitEvents: CommitEvents): VoteCommand => async () => {
  commitEvents([
    {
      id: generate(),
      type: 'UserFoundReviewHelpful',
      date: new Date(),
      userId: toUserId('someuser'),
      reviewId: new Doi('10.1111/12345678'),
    },
  ]);
};
