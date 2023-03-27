/* eslint-disable no-console */
import {
  click, currentURL, goto, openBrowser, openTab, switchTo,
} from 'taiko';
import { arbitraryString } from '../../test/helpers';
import { callApi } from '../helpers/call-api.helper';
import { screenshotTeardown } from '../utilities';
import { arbitraryUserId } from '../../test/types/user-id.helper';
import { arbitraryUserHandle } from '../../test/types/user-handle.helper';
import { completeLoginViaStubWithSpecifiedUserId } from '../helpers/complete-login-via-stub-with-specified-user-id';

describe('forced-login-from-outdated-page', () => {
  const userId = arbitraryUserId();
  const existingUserHandle = arbitraryUserHandle();

  beforeAll(async () => {
    await callApi('api/create-user', {
      userId,
      handle: existingUserHandle,
      avatarUrl: 'http://somethingthatproducesa404',
      displayName: arbitraryString(),
    });
  });

  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when I am on the article page and I log in successfully', () => {
    const articleId = '10.1101/2022.09.23.22280264';
    const articlePage = `localhost:8080/articles/activity/${articleId}`;

    beforeEach(async () => {
      await goto(articlePage);
      await click('Log In');
      await completeLoginViaStubWithSpecifiedUserId(userId);
    });

    describe('when I log out from another tab', () => {
      beforeEach(async () => {
        await openTab('localhost:8080/');
        await click('Log out');
      });

      describe('when I go back to the original tab and I attempt to save the article', () => {
        beforeEach(async () => {
          await switchTo(new RegExp(articlePage));
          console.log(await currentURL());
          await click('Save article');
        });

        describe('when I log back in again', () => {
          beforeEach(async () => {
            await completeLoginViaStubWithSpecifiedUserId(userId);
          });

          it('i am still on the article page', async () => {
            const result = await currentURL();

            expect(result).toContain(articlePage);
          });
        });
      });
    });
  });
});
