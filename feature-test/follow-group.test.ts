import {
  $, click, goto, openBrowser, text, within,
} from 'taiko';
import { createUserAccountAndLogIn } from './helpers/create-user-account-and-log-in.helper';
import { arbitraryUserId } from '../test/types/user-id.helper';
import { screenshotTeardown } from './utilities';
import { callApi } from './helpers/call-api.helper';
import { arbitraryGroup } from '../test/types/group.helper';

describe('follow a group', () => {
  const group = arbitraryGroup();

  beforeEach(async () => {
    await openBrowser();
    await callApi('api/add-group', {
      ...group,
      groupId: group.id,
    });
  });

  afterEach(screenshotTeardown);

  describe('when logged in', () => {
    beforeEach(async () => {
      await createUserAccountAndLogIn(arbitraryUserId());
    });

    it('adds the group to the user page', async () => {
      await goto('localhost:8080/groups');
      await click(group.name);
      await click('Follow');
      await click('My lists');
      await click('Following');
      const groupExists = await text(group.name, within($('.followed-groups-list'))).exists();

      expect(groupExists).toBe(true);
    });
  });
});
