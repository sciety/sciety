import {
  $, click, currentURL, goto, openBrowser,
} from 'taiko';
import { arbitraryString } from '../../test/helpers';
import { callApi } from '../helpers/call-api.helper';
import { screenshotTeardown } from '../utilities';
import { arbitraryUserId } from '../../test/types/user-id.helper';
import { arbitraryUserHandle } from '../../test/types/user-handle.helper';
import { completeLoginViaStubWithSpecifiedUserId } from '../helpers/complete-login-via-stub-with-specified-user-id';
import { arbitraryGroup } from '../../test/types/group.helper';

describe('login-via-call-to-action', () => {
  const groupA = arbitraryGroup();
  const userId = arbitraryUserId();
  const existingUserHandle = arbitraryUserHandle();

  beforeAll(async () => {
    await callApi('api/create-user', {
      userId,
      handle: existingUserHandle,
      avatarUrl: 'http://somethingthatproducesa404',
      displayName: arbitraryString(),
    });
    await callApi('api/add-group', {
      ...groupA,
      groupId: groupA.id,
    });
  });

  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when I am on the group page and I am not logged in', () => {
    const groupPageAboutTab = `http://localhost:8080/groups/${groupA.slug}/about`;

    beforeEach(async () => {
      await goto(groupPageAboutTab);
    });

    describe('when I attempt to follow the group and successfully log in', () => {
      beforeEach(async () => {
        await click('Follow');
        await completeLoginViaStubWithSpecifiedUserId(userId);
      });

      it('i am still on the group page and I am logged in', async () => {
        const result = await currentURL();
        const buttonText = await $('.utility-bar__list_link_button').text();

        expect(result).toBe(groupPageAboutTab);

        expect(buttonText).toBe('Log Out');
      });
    });
  });
});
