import { Maybe } from 'true-myth';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

export type RenderReviewResponses = (reviewId: ReviewId, userId: Maybe<UserId>) => Promise<string>;

// TODO Try introducing a Counter type to prevent impossible numbers (e.g. -1, 2.5)
export type CountReviewResponses = (reviewId: ReviewId) => Promise<{ helpfulCount: number, notHelpfulCount: number }>;
export type GetUserReviewResponse = (reviewId: ReviewId, userId: Maybe<UserId>) => Promise<Maybe<'helpful' | 'not-helpful'>>;

export default (
  countReviewResponses: CountReviewResponses,
  getUserReviewResponse: GetUserReviewResponse,
): RenderReviewResponses => (
  async (reviewId, userId) => {
    const { helpfulCount, notHelpfulCount } = await countReviewResponses(reviewId);
    const current = await getUserReviewResponse(reviewId, userId);

    const saidHelpful = current.isJust() && current.unsafelyUnwrap() === 'helpful';
    const saidNotHelpful = current.isJust() && current.unsafelyUnwrap() === 'not-helpful';

    // TODO: Move 'You said this review is helpful' etc to visually hidden span before button.
    // TODO: Change the label when the other button is selected
    const helpfulButton = saidHelpful
      ? '<button type="submit" name="command" value="revoke-response" aria-label="You said this review is helpful; press to undo." class="responses__button"><img src="/static/images/thumb-up-solid.svg" alt=""></button>'
      : `<button type="submit" name="command" value="respond-helpful" aria-label="This review is helpful" class="responses__button">
      <img src="/static/images/thumb-up-outline.svg" alt="">
      </button>`;
    const notHelpfulButton = saidNotHelpful
      ? '<button type="submit" aria-label="You said this review is not helpful; press to undo." class="responses__button"><img src="/static/images/thumb-down-solid.svg" alt=""></button>'
      : '<button type="submit" aria-label="This review is not helpful" class="responses__button"><img src="/static/images/thumb-down-outline.svg" alt=""></button>';
    return `
    <div class="responses">
      <div class="responses__question">Did you find this review helpful?</div>
      <div class="responses__actions">
        <div class="responses__action">
          <form method="post" action="/respond">
            <input type="hidden" name="reviewid" value="${reviewId.toString()}">
            ${helpfulButton}
          </form>
          ${helpfulCount}
          <span class="visually-hidden">people said this review is helpful</span>
        </div>
        <div class="responses__action">
          <form method="post" action="/respond">
            <input type="hidden" name="reviewid" value="${reviewId.toString()}">
            ${notHelpfulButton}
          </form>
          ${notHelpfulCount}
          <span class="visually-hidden">people said this review is not helpful</span>
        </div>
      </div>
    </div>
  `;
  }
);
