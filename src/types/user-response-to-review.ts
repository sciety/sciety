import { DomainEvent } from './domain-events';
import { generate } from './event-id';
import { ReviewId } from './review-id';
import { UserId } from './user-id';

export default class UserResponseToReview {
  private readonly userId: UserId;

  private readonly reviewId: ReviewId;

  constructor(userId: UserId, reviewId: ReviewId) {
    this.userId = userId;
    this.reviewId = reviewId;
  }

  respondHelpful(): ReadonlyArray<DomainEvent> {
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
