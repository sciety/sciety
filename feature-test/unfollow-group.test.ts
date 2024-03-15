import {
  $, click, goto, openBrowser, text, within,
} from 'taiko';
import { callApi } from './helpers/call-api.helper';
import { screenshotTeardown } from './utilities';
import { arbitraryUserId } from '../test/types/user-id.helper';
import { createUserAccountAndLogIn } from './helpers/create-user-account-and-log-in.helper';
import { arbitraryAddGroupCommand } from '../test/write-side/commands/add-group-command.helper';

describe('unfollow a group', () => {
  const command = arbitraryAddGroupCommand();

  beforeEach(async () => {
    await openBrowser();
    await callApi('api/add-group', command);
  });

  afterEach(screenshotTeardown);

  describe('when logged in', () => {
    beforeEach(async () => {
      await createUserAccountAndLogIn(arbitraryUserId());
    });

    describe('from a group page', () => {
      it('removes the group from user page', async () => {
        await goto(`localhost:8080/groups/${command.slug}`);
        await click('Follow');
        await click('Unfollow');
        await click('My lists');
        await click('Following');
        const groupExists = await text(command.name, within($('.followed-groups'))).exists();

        expect(groupExists).toBe(false);
      });
    });
  });
});
