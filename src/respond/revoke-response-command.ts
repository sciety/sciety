import { UserRevokedFindingReviewHelpfulEvent } from '../types/domain-events';
import { generate } from '../types/event-id';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

type RevokeResponse = (userId: UserId, reviewId: ReviewId) => Promise<
ReadonlyArray<UserRevokedFindingReviewHelpfulEvent>
>;

// TODO: change lint config to reflect our decision to use named functions
// eslint-disable-next-line import/prefer-default-export
export const revokeResponse = (): RevokeResponse => async (userId, reviewId) => [
  {
    id: generate(),
    type: 'UserRevokedFindingReviewHelpful',
    date: new Date(),
    userId,
    reviewId,
  },
];
