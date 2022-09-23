import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { executeCommand } from '../../src/add-group/execute-command';
import { groupJoined } from '../../src/domain-events';
import { DescriptionPath } from '../../src/types/description-path';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../helpers';
import { arbitraryGroupId } from '../types/group-id.helper';

describe('execute-command', () => {
  const newGroup = {
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
    );

    it('succeeds and raises an event', () => {
      expect(result).toStrictEqual(E.right([expect.objectContaining({
        type: 'GroupJoined',
        ...newGroup,
      })]));
    });
  });

  describe('when the group already exists', () => {
    const result = pipe(
      [
        groupJoined({
          id: arbitraryGroupId(),
          ...newGroup,
        }),
      ],
      executeCommand(newGroup),
    );

    it('fails with no events raised', () => {
      expect(result).toStrictEqual(E.left(expect.stringContaining(newGroup.slug)));
    });
  });
});
