import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { executeCommand } from '../../src/add-group/execute-command';
import { groupJoined, ListCreatedEvent } from '../../src/domain-events';
import { arbitraryWord } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryGroupId } from '../types/group-id.helper';
import * as LOID from '../../src/types/list-owner-id';
import { arbitraryGroup } from '../types/group.helper';

describe('execute-command', () => {
  const newGroup = arbitraryGroup();

  describe('when the group does not exist', () => {
    const result = pipe(
      [],
      executeCommand(newGroup),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('creates the group', () => {
      expect(result[0]).toStrictEqual(expect.objectContaining({
        type: 'GroupJoined',
        groupId: newGroup.id,
        name: newGroup.name,
        shortDescription: newGroup.shortDescription,
        homepage: newGroup.homepage,
        avatarPath: newGroup.avatarPath,
        descriptionPath: newGroup.descriptionPath,
        slug: newGroup.slug,
      }));
    });

    it('creates a list owned by the group', () => {
      expect(result[1]).toStrictEqual(expect.objectContaining({
        type: 'ListCreated',
        ownerId: LOID.fromGroupId(newGroup.id),
        description: expect.stringContaining(newGroup.name),
      }));
    });

    it.failing('identifes the list as the target for ingestion', () => {
      expect(result[2]).toStrictEqual(expect.objectContaining({
        type: 'EvaluatedArticlesListSpecified',
        groupId: newGroup.id,
        listId: (result[1] as ListCreatedEvent).listId,
      }));
    });
  });

  describe('when the slug is already in use', () => {
    const slug = arbitraryWord();
    const result = pipe(
      [
        groupJoined({ ...arbitraryGroup(), slug }),
      ],
      executeCommand({ ...arbitraryGroup(), slug }),
    );

    it('fails with no events raised', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('when the group already exists', () => {
    const id = arbitraryGroupId();
    const result = pipe(
      [
        groupJoined({ ...arbitraryGroup(), id }),
      ],
      executeCommand({ ...arbitraryGroup(), id }),
    );

    it('fails with no events raised', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});
