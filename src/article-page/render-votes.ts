import { ReviewId } from '../types/review-id';
import toUserId, { UserId } from '../types/user-id';

export type RenderVotes = (reviewId: ReviewId) => Promise<string>;

export type GetVotes = (reviewId: ReviewId) => Promise<{upVotes: number, downVotes: number}>;
type GetUserCurrentVotes = (userId: UserId) => Promise<{upVoted:boolean, downVoted: boolean}>;

export default (
  getVotes: GetVotes,
  getUserCurrentVotes: GetUserCurrentVotes,
): RenderVotes => (
  async (reviewId) => {
    const { upVotes, downVotes } = await getVotes(reviewId);
    const current = await getUserCurrentVotes(toUserId('fake'));
    const upButton = current.upVoted
      ? '<button type="submit" aria-label="Cancel your helpful vote" class="votes__button"><img src="/static/images/thumb-up-solid.svg" alt=""></button>'
      : '<button type="submit" aria-label="Indicate that this review is helpful" class="votes__button"><img src="/static/images/thumb-up-outline.svg" alt=""></button>';
    const downButton = current.downVoted
      ? '<button type="submit" aria-label="Cancel your unhelpful vote" class="votes__button"><img src="/static/images/thumb-down-solid.svg" alt=""></button>'
      : '<button type="submit" aria-label="Indicate that this review is unhelpful" class="votes__button"><img src="/static/images/thumb-down-outline.svg" alt=""></button>';
    return `
    <div class="votes">
      <div class="votes__question">Did you find this helpful?</div>
      <div class="votes__actions">
        <div class="votes__action">
          <form method="post" action="/vote">
            <input type="hidden" name="reviewid" value="${reviewId.toString()}">
            <input type="hidden" name="intention" value="toggle-upvote">
            ${upButton}
          </form>
          ${upVotes}
          <span class="visually-hidden">people found this helpful</span>
        </div>
        <div class="votes__action">
          <form method="post" action="/vote">
            <input type="hidden" name="reviewid" value="${reviewId.toString()}">
            <input type="hidden" name="intention" value="toggle-downvote">
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
