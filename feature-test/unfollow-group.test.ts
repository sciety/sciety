import {
  $, click, goto, openBrowser, text, within,
} from 'taiko';
import { callApi } from './helpers/call-api.helper.js';
import { screenshotTeardown } from './utilities.js';
import { arbitraryUserId } from '../test/types/user-id.helper.js';
import { createUserAccountAndLogIn } from './helpers/create-user-account-and-log-in.helper.js';
import { arbitraryGroup } from '../test/types/group.helper.js';

describe('unfollow a group', () => {
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

    describe('from a group page', () => {
      it('removes the group from user page', async () => {
        await goto(`localhost:8080/groups/${group.slug}`);
        await click('Follow');
        await click('Unfollow');
        await click('My lists');
        await click('Following');
        const groupExists = await text(group.name, within($('.followed-groups'))).exists();

        expect(groupExists).toBe(false);
      });
    });
  });
});
