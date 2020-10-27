import { ReviewId } from '../types/review-id';

export type RenderVotes = (reviewId: ReviewId) => Promise<string>;

export type GetVotes = (reviewId: ReviewId) => Promise<{upVotes: number, downVotes: number}>;

export default (getVotes: GetVotes): RenderVotes => (
  async (reviewId) => {
    const { upVotes, downVotes } = await getVotes(reviewId);
    return `
    <div>
      ${upVotes} people found this helpful
      <form method="post" action="/upvote">
        <input type="hidden" name="reviewid" value="${reviewId.toString()}">
        <button type="submit" aria-label="Indicate that this review is helpful"><img src="/static/images/thumb-up-outline.svg" alt=""></button>
      </form>
      ${downVotes} people found this unhelpful
      <form method="post" action="/downvote">
        <input type="hidden" name="reviewid" value="${reviewId.toString()}">
        <button type="submit" aria-label="Indicate that this review is not helpful"><img src="/static/images/thumb-down-outline.svg" alt=""></button>
      </form>
    </div>
  `;
  }
);
