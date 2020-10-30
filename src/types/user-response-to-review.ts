import { UserFoundReviewHelpfulEvent, UserRevokedFindingReviewHelpfulEvent } from './domain-events';
import { generate } from './event-id';
import { ReviewId } from './review-id';
import { UserId } from './user-id';

type Response = 'no-response' | 'helpful';

export default class UserResponseToReview {
  private readonly userId: UserId;

  private readonly reviewId: ReviewId;

  private response: Response;

  constructor(userId: UserId, reviewId: ReviewId, response: Response = 'no-response') {
    this.userId = userId;
    this.reviewId = reviewId;
    this.response = response;
  }

  respondHelpful(): ReadonlyArray<UserFoundReviewHelpfulEvent> {
    if (this.response === 'helpful') {
      return [];
    }
    this.response = 'helpful';
    return [
      {
        id: generate(),
        type: 'UserFoundReviewHelpful',
        date: new Date(),
        userId: this.userId,
        reviewId: this.reviewId,
      },
    ];
  }

  revokeResponse(): ReadonlyArray<UserRevokedFindingReviewHelpfulEvent> {
    return [
      {
        id: generate(),
        type: 'UserRevokedFindingReviewHelpful',
        date: new Date(),
        userId: this.userId,
        reviewId: this.reviewId,
      },
    ];
  }
}
