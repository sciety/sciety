import { DomainEvent, isUserFollowedEditorialCommunityEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

type ProjectFollowerIds = (editorialCommunityId: EditorialCommunityId) => Promise<ReadonlyArray<UserId>>;

export type GetAllEvents = () => Promise<ReadonlyArray<DomainEvent>>;

export default (getAllEvents: GetAllEvents): ProjectFollowerIds => (
  async (editorialCommunityId) => (
    (await getAllEvents())
      .filter(isUserFollowedEditorialCommunityEvent)
      .filter((event) => event.editorialCommunityId.value === editorialCommunityId.value)
      .map((event) => event.userId)
  )
);
