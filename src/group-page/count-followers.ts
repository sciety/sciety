import * as RA from 'fp-ts/ReadonlyArray';
import {
  DomainEvent,
  isUserFollowedEditorialCommunityEvent,
  isUserUnfollowedEditorialCommunityEvent,
} from '../types/domain-events';
import { GroupId } from '../types/group-id';

type Reducer = (groupId: GroupId) => (count: number, event: DomainEvent) => number;

const counter: Reducer = (groupId) => (count, event) => {
  if (isUserFollowedEditorialCommunityEvent(event) && event.editorialCommunityId === groupId) {
    return count + 1;
  }
  if (isUserUnfollowedEditorialCommunityEvent(event) && event.editorialCommunityId === groupId) {
    return count - 1;
  }
  return count;
};

type CountFollowersOf = (groupId: GroupId) => (events: ReadonlyArray<DomainEvent>) => number;

export const countFollowersOf: CountFollowersOf = (groupId) => RA.reduce(0, counter(groupId));
