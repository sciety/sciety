import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { Maybe } from 'true-myth';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

export type RenderReviewResponses = (reviewId: ReviewId, userId: O.Option<UserId>) => T.Task<HtmlFragment>;

// TODO Try introducing a Counter type to prevent impossible numbers (e.g. -1, 2.5)
export type CountReviewResponses = (reviewId: ReviewId) => T.Task<{ helpfulCount: number, notHelpfulCount: number }>;
export type GetUserReviewResponse = (reviewId: ReviewId, userId: O.Option<UserId>) => Promise<Maybe<'helpful' | 'not-helpful'>>;

export const createRenderReviewResponses = (
  countReviewResponses: CountReviewResponses,
  getUserReviewResponse: GetUserReviewResponse,
): RenderReviewResponses => (
  (reviewId, userId) => async () => {
    const { helpfulCount, notHelpfulCount } = await countReviewResponses(reviewId)();
    const current = await getUserReviewResponse(reviewId, userId);

    const saidHelpful = current.isJust() && current.unsafelyUnwrap() === 'helpful';
    const saidNotHelpful = current.isJust() && current.unsafelyUnwrap() === 'not-helpful';

    // TODO: Move 'You said this evaluation is helpful' etc to visually hidden span before button.
    // TODO: Change the label when the other button is selected
    const helpfulButton = saidHelpful
      ? toHtmlFragment('<button type="submit" name="command" value="revoke-response" aria-label="You said this evaluation is helpful; press to undo." class="responses__button"><img src="/static/images/thumb-up-solid.svg" alt=""></button>')
      : toHtmlFragment(`<button type="submit" name="command" value="respond-helpful" aria-label="This evaluation is helpful" class="responses__button">
      <img src="/static/images/thumb-up-outline.svg" alt="">
      </button>`);
    const notHelpfulButton = saidNotHelpful
      ? toHtmlFragment('<button type="submit" name="command" value="revoke-response" aria-label="You said this evaluation is not helpful; press to undo." class="responses__button"><img src="/static/images/thumb-down-solid.svg" alt=""></button>')
      : toHtmlFragment('<button type="submit" name="command" value="respond-not-helpful" aria-label="This evaluation is not helpful" class="responses__button"><img src="/static/images/thumb-down-outline.svg" alt=""></button>');
    return toHtmlFragment(`
    <div class="responses">
      <div class="responses__question">Did you find this evaluation helpful?</div>
      <div class="responses__actions">
        <div class="responses__action">
          <form method="post" action="/respond">
            <input type="hidden" name="reviewid" value="${reviewId.toString()}">
            ${helpfulButton}
          </form>
          ${helpfulCount}
          <span class="visually-hidden">people said this evaluation is helpful</span>
        </div>
        <div class="responses__action">
          <form method="post" action="/respond">
            <input type="hidden" name="reviewid" value="${reviewId.toString()}">
            ${notHelpfulButton}
          </form>
          ${notHelpfulCount}
          <span class="visually-hidden">people said this evaluation is not helpful</span>
        </div>
      </div>
    </div>
  `);
  }
);
