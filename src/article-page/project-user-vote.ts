import { GetUserVote } from './render-votes';
import { DomainEvent } from '../types/domain-events';

type GetEvents = () => Promise<ReadonlyArray<DomainEvent>>;

export default (getEvents: GetEvents): GetUserVote => (async () => {
  const events = await getEvents();
  const voteEvents = events.filter((event) => event.type === 'UserFoundReviewHelpful');

  return voteEvents.length > 0 ? 'up' : 'not';
});
