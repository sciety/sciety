import {
  $, click, currentURL, goto, openBrowser, text, within,
} from 'taiko';
import { createUserAccountAndLogIn } from './helpers/create-user-account-and-log-in.helper';
import { arbitraryUserId } from '../test/types/user-id.helper';
import { screenshotTeardown } from './utilities';
import { callApi } from './helpers/call-api.helper';
import { arbitraryGroup } from '../test/types/group.helper';
import { Group } from '../src/types/group';
import { arbitraryString } from '../test/helpers';

describe('follow a group', () => {
  let group: Group;

  beforeEach(async () => {
    group = arbitraryGroup();
    await openBrowser();
    await callApi('api/add-group', {
      ...group,
      groupId: group.id,
      largeLogoPath: arbitraryString(),
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
