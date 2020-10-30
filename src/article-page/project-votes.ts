import { GetVotes } from './render-review-responses';
import Doi from '../types/doi';
import { DomainEvent, UserFoundReviewHelpfulEvent } from '../types/domain-events';

export type GetEvents = () => Promise<ReadonlyArray<DomainEvent>>;

export default (getEvents: GetEvents): GetVotes => (
  async (reviewId) => {
    const upVotes = (await getEvents())
      .filter((event): event is UserFoundReviewHelpfulEvent => event.type === 'UserFoundReviewHelpful')
      .filter((event) => event.reviewId.toString() === reviewId.toString())
      .length;
    if (reviewId instanceof Doi) {
      return { upVotes, downVotes: 8 };
    }
    return { upVotes, downVotes: 9 };
  }
);
