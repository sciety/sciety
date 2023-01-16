/* eslint-disable @typescript-eslint/no-unused-vars */
import { DomainEvent } from '../domain-events';
import { GroupId } from '../types/group-id';
import { DescriptionPath } from '../types/description-path';

type GroupDataToAdd = {
  groupId: GroupId,
  name: string,
  avatarPath: string,
  descriptionPath: DescriptionPath,
  shortDescription: string,
  homepage: string,
  slug: string,
  date: Date,
};

type BackfillGroupJoinedEvents = (
  events: ReadonlyArray<DomainEvent>
) => (groupsToBeAdded: ReadonlyArray<GroupDataToAdd>) => ReadonlyArray<DomainEvent>;

// ts-unused-exports:disable-next-line
export const backfillGroupJoinedEvents: BackfillGroupJoinedEvents = (events) => (groupsToBeAdded) => [];
