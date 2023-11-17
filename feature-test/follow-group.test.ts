import {
  $, click, currentURL, goto, openBrowser, text, within,
} from 'taiko';
import { createUserAccountAndLogIn } from './helpers/create-user-account-and-log-in.helper.js';
import { arbitraryUserId } from '../test/types/user-id.helper.js';
import { screenshotTeardown } from './utilities.js';
import { callApi } from './helpers/call-api.helper.js';
import { arbitraryGroup } from '../test/types/group.helper.js';
import { Group } from '../src/types/group.js';

describe('follow a group', () => {
  let group: Group;

  beforeEach(async () => {
    group = arbitraryGroup();
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

    describe('after clicking on the Follow button', () => {
      beforeEach(async () => {
        await goto(`localhost:8080/groups/${group.slug}`);
        await click('Follow');
      });

      it('returns to the group page', async () => {
        const result = await currentURL();

        expect(result).toContain(`/groups/${group.slug}`);
      });

      it('adds the group to the user page', async () => {
        await click('My lists');
        await click('Following');
        const groupExists = await text(group.name, within($('.card-list'))).exists();

        expect(groupExists).toBe(true);
      });
    });
  });
});
