import * as TE from 'fp-ts/TaskEither';
import { findGroups } from '../../src/search-results-page/find-groups';
import { GroupId } from '../../src/types/group-id';

describe('find-groups', () => {
  describe('provided a valid group name', () => {
    it('returns an array containing the groupId', async () => {
      const group = {
        id: new GroupId('12345'),
        avatarPath: '',
        descriptionPath: '',
        name: 'My Group',
        shortDescription: '',
      };
      const result = await findGroups(() => TE.right(''), [group])('My Group')();

      expect(result).toStrictEqual([new GroupId('12345')]);
    });
  });
});
