import {
  $, click, goto, openBrowser, text, within,
} from 'taiko';
import { createUserAccountAndLogIn } from './helpers/create-user-account-and-log-in.helper';
import { arbitraryUserId } from '../test/types/user-id.helper';
import { screenshotTeardown } from './utilities';
import { arbitraryWord, arbitraryString, arbitraryUri } from '../test/helpers';
import { arbitraryDescriptionPath } from '../test/types/description-path.helper';
import { arbitraryGroupId } from '../test/types/group-id.helper';
import { callApi } from './helpers/call-api.helper';

describe('follow a group', () => {
  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when logged in', () => {
    const groupName = arbitraryString();

    beforeEach(async () => {
      await callApi('api/add-group', {
        groupId: arbitraryGroupId(),
        name: groupName,
        shortDescription: arbitraryString(),
        homepage: arbitraryString(),
        avatarPath: arbitraryUri(),
        descriptionPath: arbitraryDescriptionPath(),
        slug: arbitraryWord(),
      });
      await createUserAccountAndLogIn(arbitraryUserId());
    });

    it('adds the group to the user page', async () => {
      await goto('localhost:8080/groups');
      await click(groupName);
      await click('Follow');
      await click('My lists');
      await click('Following');
      const groupExists = await text(groupName, within($('.followed-groups-list'))).exists();

      expect(groupExists).toBe(true);
    });
  });
});
