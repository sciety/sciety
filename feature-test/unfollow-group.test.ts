import {
  $, click, goto, openBrowser, text, within,
} from 'taiko';
import { arbitraryGroupId } from '../test/types/group-id.helper';
import { arbitraryDescriptionPath } from '../test/types/description-path.helper';
import { arbitraryString, arbitraryWord } from '../test/helpers';
import { callApi } from './call-api.helper';
import { screenshotTeardown } from './utilities';
import { arbitraryUserId } from '../test/types/user-id.helper';

describe.skip('unfollow a group', () => {
  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when logged in', () => {
    beforeEach(async () => {
      await goto(`localhost:8080/log-in-as?userId=${arbitraryUserId()}`);
    });

    describe('from a group page', () => {
      it('removes the group from user page', async () => {
        const groupSlug = arbitraryWord();
        const groupName = arbitraryString();
        await callApi('api/add-group', {
          groupId: arbitraryGroupId(),
          name: groupName,
          shortDescription: arbitraryString(),
          homepage: arbitraryString(),
          avatarPath: 'http://somethingthatreturns404',
          descriptionPath: arbitraryDescriptionPath(),
          slug: groupSlug,
        });
        await goto(`localhost:8080/groups/${groupSlug}`);
        await click('Follow');
        await click('Unfollow');
        await click('My lists');
        const groupExists = await text(groupName, within($('.followed-groups'))).exists();

        expect(groupExists).toBe(false);
      });
    });
  });
});
