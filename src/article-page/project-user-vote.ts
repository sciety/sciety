import { GetUserVote } from './render-votes';
import { DomainEvent, UserFoundReviewHelpfulEvent } from '../types/domain-events';

type GetEvents = () => Promise<ReadonlyArray<DomainEvent>>;

export default (getEvents: GetEvents): GetUserVote => (
  async (reviewId, userId) => {
    const events = await getEvents();
    const voteEvents = events
      .filter((event): event is UserFoundReviewHelpfulEvent => event.type === 'UserFoundReviewHelpful')
      .filter((event) => event.userId === userId);

    return voteEvents.length > 0 ? 'up' : 'not';
  }
);
