import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { update } from '../../../../src/write-side/resources/group';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryString, arbitraryUri } from '../../../helpers';
import { DomainEvent, constructEvent } from '../../../../src/domain-events';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import { arbitraryDescriptionPath } from '../../../types/description-path.helper';
import { arbitraryGroup } from '../../../types/group.helper';
import { GroupId } from '../../../../src/types/group-id';

const arbitraryGroupJoinedEvent = (groupId: GroupId) => pipe(
  {
    groupId,
    name: arbitraryString(),
    avatarPath: arbitraryUri(),
    descriptionPath: arbitraryDescriptionPath(),
    shortDescription: arbitraryString(),
    homepage: arbitraryString(),
    slug: arbitraryString(),
  },
  constructEvent('GroupJoined'),
);

describe('update', () => {
  describe('when the group has joined', () => {
    describe('and they have never updated their details', () => {
      const groupId = arbitraryGroupId();

      describe('when passed a new name for the group', () => {
        const name = arbitraryString();
        const existingEvents = [
          constructEvent('GroupJoined')({
            groupId,
            name,
            avatarPath: arbitraryUri(),
            descriptionPath: arbitraryDescriptionPath(),
            shortDescription: arbitraryString(),
            homepage: arbitraryString(),
            slug: arbitraryString(),
          }),
        ];
        const newName = arbitraryString();
        const command = {
          groupId,
          name: newName,
        };
        let events: ReadonlyArray<DomainEvent>;

        beforeEach(() => {
          events = pipe(
            update(command)(existingEvents),
            E.getOrElseW(shouldNotBeCalled),
          );
        });

        it('raises an event to update the group name', () => {
          expect(events).toStrictEqual([
            expect.objectContaining({
              groupId,
              name: newName,
            }),
          ]);
        });
      });

      describe('when passed the group\'s existing name', () => {
        const name = arbitraryString();
        const existingEvents = [
          constructEvent('GroupJoined')({
            groupId,
            name,
            avatarPath: arbitraryUri(),
            descriptionPath: arbitraryDescriptionPath(),
            shortDescription: arbitraryString(),
            homepage: arbitraryString(),
            slug: arbitraryString(),
          }),
        ];

        const command = {
          groupId,
          name,
        };
        let events: ReadonlyArray<DomainEvent>;

        beforeEach(() => {
          events = pipe(
            update(command)(existingEvents),
            E.getOrElseW(shouldNotBeCalled),
          );
        });

        it('raises no events', () => {
          expect(events).toStrictEqual([]);
        });
      });

      describe('when passed the name of a different existing group', () => {
        const groupToUpdate = arbitraryGroup();
        const preExistingGroup = arbitraryGroup();
        const existingEvents = [
          constructEvent('GroupJoined')({
            groupId: groupToUpdate.id,
            name: groupToUpdate.name,
            avatarPath: arbitraryUri(),
            descriptionPath: arbitraryDescriptionPath(),
            shortDescription: arbitraryString(),
            homepage: arbitraryString(),
            slug: arbitraryString(),
          }),
          constructEvent('GroupJoined')({
            groupId: preExistingGroup.id,
            name: preExistingGroup.name,
            avatarPath: arbitraryUri(),
            descriptionPath: arbitraryDescriptionPath(),
            shortDescription: arbitraryString(),
            homepage: arbitraryString(),
            slug: arbitraryString(),
          }),
        ];
        const command = {
          groupId: groupToUpdate.id,
          name: preExistingGroup.name,
        };
        const result = update(command)(existingEvents);

        it('returns an error', () => {
          expect(E.isLeft(result)).toBe(true);
        });
      });
    });

    describe('and they have previously updated their details', () => {
      describe('when passed the group\'s existing name', () => {
        const groupId = arbitraryGroupId();
        const name = arbitraryString();
        const existingEvents = [
          arbitraryGroupJoinedEvent(groupId),
          constructEvent('GroupDetailsUpdated')({
            groupId,
            name,
            avatarPath: undefined,
            descriptionPath: undefined,
            shortDescription: undefined,
            homepage: undefined,
            slug: undefined,
          }),
        ];
        const events = pipe(
          update({ groupId, name })(existingEvents),
          E.getOrElseW(shouldNotBeCalled),
        );

        it.failing('raises no events', () => {
          expect(events).toStrictEqual([]);
        });
      });

      describe('when passed the name of a different existing group', () => {
        it.todo('returns an error');
      });
    });
  });

  describe('when the group has not joined', () => {
    describe('when passed any command', () => {
      it.todo('fails');
    });
  });
});
