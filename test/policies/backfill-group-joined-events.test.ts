import * as GID from '../../src/types/group-id';
import { backfillGroupJoinedEvents } from '../../src/policies/backfill-group-joined-events';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryDate, arbitraryString } from '../helpers';
import { arbitraryDescriptionPath } from '../types/description-path.helper';
import { DomainEvent, groupJoined } from '../../src/domain-events';

describe('backfill-group-joined-events', () => {
  describe('when there is no pre-existing groupJoined event for the supplied group', () => {
    it.failing('raises a groupJoined event for the supplied group', () => {
      const groupToBeAdded = {
        groupId: arbitraryGroupId(),
        name: arbitraryString(),
        avatarPath: arbitraryString(),
        descriptionPath: arbitraryDescriptionPath(),
        shortDescription: arbitraryString(),
        homepage: arbitraryString(),
        slug: arbitraryString(),
        date: arbitraryDate(),
      };
      const aDifferentGroup = {
        groupId: arbitraryGroupId(),
        name: arbitraryString(),
        avatarPath: arbitraryString(),
        descriptionPath: arbitraryDescriptionPath(),
        shortDescription: arbitraryString(),
        homepage: arbitraryString(),
        slug: arbitraryString(),
        date: arbitraryDate(),
      };
      const events: ReadonlyArray<DomainEvent> = [
        groupJoined(
          aDifferentGroup.groupId,
          aDifferentGroup.name,
          aDifferentGroup.avatarPath,
          aDifferentGroup.descriptionPath,
          aDifferentGroup.shortDescription,
          aDifferentGroup.homepage,
          aDifferentGroup.slug,
          aDifferentGroup.date,
        ),
      ];
      const eventsToCommit = backfillGroupJoinedEvents(events)([groupToBeAdded]);

      expect(eventsToCommit).toStrictEqual([expect.objectContaining({
        type: 'GroupJoined',
        groupId: GID.fromString(groupToBeAdded.groupId),
      })]);
    });
  });

  describe('when there is a pre-existing groupJoined event for the supplied group', () => {
    const groupToBeAdded = {
      groupId: arbitraryGroupId(),
      name: arbitraryString(),
      avatarPath: arbitraryString(),
      descriptionPath: arbitraryDescriptionPath(),
      shortDescription: arbitraryString(),
      homepage: arbitraryString(),
      slug: arbitraryString(),
      date: arbitraryDate(),
    };
    const events: ReadonlyArray<DomainEvent> = [
      groupJoined(
        groupToBeAdded.groupId,
        arbitraryString(),
        arbitraryString(),
        arbitraryDescriptionPath(),
        arbitraryString(),
        arbitraryString(),
        arbitraryString(),
      ),
    ];
    const eventsToCommit = backfillGroupJoinedEvents(events)([groupToBeAdded]);

    it('does not raise a groupJoined event for the supplied group', () => {
      expect(eventsToCommit).toStrictEqual([]);
    });
  });
});
