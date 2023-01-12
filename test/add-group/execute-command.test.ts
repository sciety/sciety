import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { executeCommand } from '../../src/add-group/execute-command';
import { groupJoined, ListCreatedEvent } from '../../src/domain-events';
import { DescriptionPath } from '../../src/types/description-path';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryGroupId } from '../types/group-id.helper';
import * as LOID from '../../src/types/list-owner-id';

describe('execute-command', () => {
  const newGroup = {
    id: arbitraryGroupId(),
    name: arbitraryWord(),
    shortDescription: arbitraryString(),
    homepage: arbitraryUri(),
    avatarPath: arbitraryUri(),
    descriptionPath: arbitraryString() as DescriptionPath,
    slug: arbitraryWord(),
  };

  describe('when the group does not exist', () => {
    const result = pipe(
      [],
      executeCommand(newGroup),
      E.getOrElseW(shouldNotBeCalled),
    );

    it.failing('creates the group', () => {
      expect(result[0]).toStrictEqual(expect.objectContaining({
        type: 'GroupJoined',
        ...newGroup,
      }));
    });

    it.failing('creates a list owned by the group', () => {
      expect(result[1]).toStrictEqual(expect.objectContaining({
        type: 'ListCreated',
        ownerId: LOID.fromGroupId(newGroup.id),
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

  describe('when the group already exists', () => {
    const result = pipe(
      [
        groupJoined(newGroup),
      ],
      executeCommand(newGroup),
    );

    it('fails with no events raised', () => {
      expect(result).toStrictEqual(E.left(expect.stringContaining(newGroup.slug)));
    });
  });
});
