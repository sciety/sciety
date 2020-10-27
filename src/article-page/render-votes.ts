import { ReviewId } from '../types/review-id';

export type RenderVotes = (reviewId: ReviewId) => Promise<string>;

export type GetVotes = (reviewId: ReviewId) => Promise<{upVotes: number, downVotes: number}>;

export default (getVotes: GetVotes): RenderVotes => (
  async (reviewId) => {
    const { upVotes, downVotes } = await getVotes(reviewId);
    return `
    <div>
      ${upVotes} people found this helpful,<br/>
      ${downVotes} people found this to be unhelpful
    </div>
  `;
  }
);
