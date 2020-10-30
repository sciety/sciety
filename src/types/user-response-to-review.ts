import { UserFoundReviewHelpfulEvent } from './domain-events';
import { generate } from './event-id';
import { ReviewId } from './review-id';
import { UserId } from './user-id';

export default class UserResponseToReview {
  private readonly userId: UserId;

  private readonly reviewId: ReviewId;

  private response: 'no-response' | 'helpful';

  constructor(userId: UserId, reviewId: ReviewId) {
    this.userId = userId;
    this.reviewId = reviewId;
    this.response = 'no-response';
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
}
