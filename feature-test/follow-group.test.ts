import {
  $, click, currentURL, goto, openBrowser, text, within,
} from 'taiko';
import { createUserAccountAndLogIn } from './helpers/create-user-account-and-log-in.helper';
import { arbitraryUserId } from '../test/types/user-id.helper';
import { screenshotTeardown } from './utilities';
import { callApi } from './helpers/call-api.helper';
import { arbitraryAddGroupCommand } from '../test/write-side/commands/add-group-command.helper';
import { AddGroupCommand } from '../src/write-side/commands';

describe('follow a group', () => {
  let command: AddGroupCommand;

  beforeEach(async () => {
    command = arbitraryAddGroupCommand();
    await openBrowser();
    await callApi('api/add-group', command);
  });

  afterEach(screenshotTeardown);

  describe('when logged in', () => {
    beforeEach(async () => {
      await createUserAccountAndLogIn(arbitraryUserId());
    });

    describe('after clicking on the Follow button', () => {
      beforeEach(async () => {
        await goto(`localhost:8080/groups/${command.slug}`);
        await click('Follow');
      });

      it('returns to the group page', async () => {
        const result = await currentURL();

        expect(result).toContain(`/groups/${command.slug}`);
      });

      it('adds the group to the user page', async () => {
        await click('My lists');
        await click('Following');
        const groupExists = await text(command.name, within($('.card-list'))).exists();

        expect(groupExists).toBe(true);
      });
    });
  });
});
