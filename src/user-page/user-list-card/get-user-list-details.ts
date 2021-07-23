import { DomainEvent } from '../../types/domain-events';

type UserListDetails = {
  articleCount: number,
};

export const getUserListDetails = (events: ReadonlyArray<DomainEvent>): UserListDetails => ({
  articleCount: events.length,
});
