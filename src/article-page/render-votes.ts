import { ReviewId } from '../types/review-id';

export type RenderVotes = (reviewId: ReviewId) => Promise<string>;

export type GetVotes = (reviewId: ReviewId) => Promise<{upVotes: number, downVotes: number}>;

export default (
  getVotes: GetVotes,
): RenderVotes => (
  async (reviewId) => {
    const { upVotes, downVotes } = await getVotes(reviewId);
    const current = {
      upVoted: true,
      downVoted: false,
    };
    const upButton = current.upVoted
      ? '<button type="submit" aria-label="Cancel your helpful vote"><img src="/static/images/thumb-up-solid.svg" alt=""></button>'
      : '<button type="submit" aria-label="Indicate that this review is helpful"><img src="/static/images/thumb-up-outline.svg" alt=""></button>';
    const downButton = current.downVoted
      ? '<button type="submit" aria-label="Cancel your unhelpful vote"><img src="/static/images/thumb-down-solid.svg" alt=""></button>'
      : '<button type="submit" aria-label="Indicate that this review is unhelpful"><img src="/static/images/thumb-down-outline.svg" alt=""></button>';
    return `
    <div>
      ${upVotes} people found this helpful
      <form method="post" action="/vote">
        <input type="hidden" name="reviewid" value="${reviewId.toString()}">
        <input type="hidden" name="intention" value="toggle-upvote">
        ${upButton}
      </form>
      ${downVotes} people found this unhelpful
      <form method="post" action="/vote">
        <input type="hidden" name="reviewid" value="${reviewId.toString()}">
        <input type="hidden" name="intention" value="toggle-downvote">
        ${downButton}
      </form>
    </div>
  `;
  }
);
