import { GetEvents } from './render-feed';
import { DomainEvent, isEditorialCommunityJoinedEvent } from '../types/domain-events';
import FollowList from '../types/follow-list';
import { NonEmptyArray } from '../types/non-empty-array';
import { UserFollowList } from '../types/user-follow-list';

export type GetFollowList = (userFollowList?: UserFollowList) => Promise<FollowList>;

type FilterFunction = (event: DomainEvent) => boolean;
export type FilterEvents = (filterFunction: FilterFunction, maxCount: number) => Promise<Array<DomainEvent>>;

export default (
  getFollowList: GetFollowList,
  filterEvents: FilterEvents,
  maxCount: number,
): GetEvents => (
  async () => {
    const followList = await getFollowList();
    const followedEvents: FilterFunction = (event) => (
      isEditorialCommunityJoinedEvent(event) || followList.follows(event.actorId)
    );
    return filterEvents(followedEvents, maxCount) as unknown as NonEmptyArray<DomainEvent>;
  }
);
