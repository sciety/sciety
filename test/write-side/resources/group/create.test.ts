import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { create } from '../../../../src/write-side/resources/group/create';
import { constructEvent, EventOfType } from '../../../../src/domain-events';
import { arbitraryString, arbitraryWord } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import * as LOID from '../../../../src/types/list-owner-id';
import { arbitraryGroupJoinedEvent } from '../../../domain-events/group-resource-events.helper';
import { arbitraryAddGroupCommand } from '../../commands/add-group-command.helper';

describe('create', () => {
  const addGroupCommand = arbitraryAddGroupCommand();

  describe('when the group does not exist', () => {
    const result = pipe(
      [],
      create(addGroupCommand),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('creates the group', () => {
      expect(result[0]).toBeDomainEvent('GroupJoined', {
        groupId: addGroupCommand.groupId,
        name: addGroupCommand.name,
        shortDescription: addGroupCommand.shortDescription,
        homepage: addGroupCommand.homepage,
        avatarPath: addGroupCommand.avatarPath,
        descriptionPath: addGroupCommand.descriptionPath,
        slug: addGroupCommand.slug,
        largeLogoPath: addGroupCommand.largeLogoPath,
      });
    });

    it('creates a list owned by the group', () => {
      expect(result[1]).toBeDomainEvent('ListCreated', {
        ownerId: LOID.fromGroupId(addGroupCommand.groupId),
        description: expect.stringContaining(addGroupCommand.name),
      });
    });

    it('identifies the list as the target for ingestion', () => {
      expect(result[2]).toBeDomainEvent('EvaluatedArticlesListSpecified', {
        groupId: addGroupCommand.groupId,
        listId: (result[1] as EventOfType<'ListCreated'>).listId,
      });
    });
  });

  describe('when passed a name value taken by another group', () => {
    const otherGroupJoinedEvent = arbitraryGroupJoinedEvent();

    describe('and the other group\'s details have never been updated', () => {
      const result = pipe(
        [
          otherGroupJoinedEvent,
        ],
        create({ ...addGroupCommand, name: otherGroupJoinedEvent.name }),
      );

      it('fails with no events raised', () => {
        expect(E.isLeft(result)).toBe(true);
      });
    });

    describe('and the other group\'s name collides due to a previous update', () => {
      const name = arbitraryString();
      const result = pipe(
        [
          otherGroupJoinedEvent,
          constructEvent('GroupDetailsUpdated')({
            groupId: otherGroupJoinedEvent.groupId,
            name,
            avatarPath: undefined,
            descriptionPath: undefined,
            largeLogoPath: undefined,
            shortDescription: undefined,
            homepage: undefined,
            slug: undefined,
          }),
        ],
        create({ ...addGroupCommand, name }),
      );

      it('fails with no events raised', () => {
        expect(E.isLeft(result)).toBe(true);
      });
    });
  });

  describe('when passed a slug value taken by another group', () => {
    const otherGroupJoinedEvent = arbitraryGroupJoinedEvent();

    describe('and the other group\'s details have never been updated', () => {
      const result = pipe(
        [
          otherGroupJoinedEvent,
        ],
        create({ ...addGroupCommand, slug: otherGroupJoinedEvent.slug }),
      );

      it('fails with no events raised', () => {
        expect(E.isLeft(result)).toBe(true);
      });
    });

    describe('and the other group\'s slug collides due to a previous update', () => {
      const slug = arbitraryWord();
      const result = pipe(
        [
          otherGroupJoinedEvent,
          constructEvent('GroupDetailsUpdated')({
            groupId: otherGroupJoinedEvent.groupId,
            name: undefined,
            avatarPath: undefined,
            descriptionPath: undefined,
            shortDescription: undefined,
            homepage: undefined,
            largeLogoPath: undefined,
            slug,
          }),
        ],
        create({ ...addGroupCommand, slug }),
      );

      it('fails with no events raised', () => {
        expect(E.isLeft(result)).toBe(true);
      });
    });
  });

  describe('when the group already exists', () => {
    const groupJoinedEvent = arbitraryGroupJoinedEvent();
    const result = pipe(
      [
        groupJoinedEvent,
      ],
      create({ ...arbitraryAddGroupCommand(), groupId: groupJoinedEvent.groupId }),
    );

    it('fails with no events raised', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});
