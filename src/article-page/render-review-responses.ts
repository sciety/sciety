import { Maybe } from 'true-myth';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

export type RenderReviewResponses = (reviewId: ReviewId, userId: Maybe<UserId>) => Promise<string>;

export type GetVotes = (reviewId: ReviewId) => Promise<{ upVotes: number, downVotes: number }>;
export type GetUserVote = (reviewId: ReviewId, userId: Maybe<UserId>) => Promise<'up' | 'down' | 'not'>;

export default (
  getVotes: GetVotes,
  getUserVote: GetUserVote,
): RenderReviewResponses => (
  async (reviewId, userId) => {
    const { upVotes, downVotes } = await getVotes(reviewId);
    const current = await getUserVote(reviewId, userId);

    const upVoted = current === 'up';
    const downVoted = current === 'down';

    // TODO: remove `vote` from all the ARIA labels
    const upButton = upVoted
      ? '<button type="submit" name="command" value="revoke-response" aria-label="Cancel your helpful vote" class="votes__button"><img src="/static/images/thumb-up-solid.svg" alt=""></button>'
      : `<button type="submit" name="command" value="respond-helpful" aria-label="Indicate that this review is helpful" class="votes__button">
      <img src="/static/images/thumb-up-outline.svg" alt="">
      </button>`;
    const downButton = downVoted
      ? '<button type="submit" aria-label="Cancel your unhelpful vote" class="votes__button"><img src="/static/images/thumb-down-solid.svg" alt=""></button>'
      : '<button type="submit" aria-label="Indicate that this review is unhelpful" class="votes__button"><img src="/static/images/thumb-down-outline.svg" alt=""></button>';
    return `
    <div class="votes">
      <div class="votes__question">Did you find this helpful?</div>
      <div class="votes__actions">
        <div class="votes__action">
          <form method="post" action="/vote">
            <input type="hidden" name="reviewid" value="${reviewId.toString()}">
            ${upButton}
          </form>
          ${upVotes}
          <span class="visually-hidden">people found this helpful</span>
        </div>
        <div class="votes__action">
          <form method="post" action="/vote">
            <input type="hidden" name="reviewid" value="${reviewId.toString()}">
            ${downButton}
          </form>
          ${downVotes}
          <span class="visually-hidden">people found this unhelpful</span>
        </div>
      </div>
    </div>
  `;
  }
);
