import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { groupJoined, isGroupJoinedEvent } from '../domain-events/group-joined-event';
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
export const backfillGroupJoinedEvents: BackfillGroupJoinedEvents = (events) => (groupsToBeAdded) => pipe(
  events,
  RA.filter(isGroupJoinedEvent),
  RA.map((event) => event.groupId),
  (existingGroupIds) => pipe(
    groupsToBeAdded,
    RA.filter(({ groupId }) => !existingGroupIds.includes(groupId)),
    RA.map((valuesToBeAdded) => groupJoined(
      valuesToBeAdded.groupId,
      valuesToBeAdded.name,
      valuesToBeAdded.avatarPath,
      valuesToBeAdded.descriptionPath,
      valuesToBeAdded.shortDescription,
      valuesToBeAdded.homepage,
      valuesToBeAdded.slug,
      valuesToBeAdded.date,
    )),
  ),
);
