import { Doi } from '../types/doi';
import { DomainEvent } from '../types/domain-events';
import { GroupId } from '../types/group-id';

type ArticleActivity = { doi: Doi, latestActivityDate: Date, evaluationCount: number };

type FollowedGroupsActivities = (
  events: ReadonlyArray<DomainEvent>
) => (
  groupIds: ReadonlyArray<GroupId>
) => ReadonlyArray<ArticleActivity>;

// ts-unused-exports:disable-next-line
export const followedGroupsActivities: FollowedGroupsActivities = () => () => [];
