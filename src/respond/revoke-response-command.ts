import { DomainEvent, UserFoundReviewHelpfulEvent, UserRevokedFindingReviewHelpfulEvent } from '../types/domain-events';
import { generate } from '../types/event-id';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

export type GetAllEvents = () => Promise<ReadonlyArray<DomainEvent>>;

type RevokeResponse = (userId: UserId, reviewId: ReviewId) => Promise<
ReadonlyArray<UserRevokedFindingReviewHelpfulEvent>
>;

// TODO: change lint config to reflect our decision to use named functions
// eslint-disable-next-line import/prefer-default-export
export const revokeResponse = (getAllEvents: GetAllEvents): RevokeResponse => async (userId, reviewId) => {
  const ofInterest = (await getAllEvents())
    .filter(
      (event): event is UserFoundReviewHelpfulEvent | UserRevokedFindingReviewHelpfulEvent => (
        event.type === 'UserFoundReviewHelpful' || event.type === 'UserRevokedFindingReviewHelpful'
      ),
    )
    .filter((event) => event.userId === userId);

  if (ofInterest.length === 0 || ofInterest[ofInterest.length - 1].type === 'UserRevokedFindingReviewHelpful') {
    return [];
  }
  return [
    {
      id: generate(),
      type: 'UserRevokedFindingReviewHelpful',
      date: new Date(),
      userId,
      reviewId,
    },
  ];
};
