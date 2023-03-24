import {
  $, click, currentURL, goto, openBrowser,
} from 'taiko';
import { createUserAccountAndLogIn } from './helpers/create-user-account-and-log-in.helper';
import { arbitraryString } from '../test/helpers';
import { arbitraryReviewId } from '../test/types/review-id.helper';
import { callApi } from './helpers/call-api.helper';
import { screenshotTeardown } from './utilities';
import { arbitraryUserId } from '../test/types/user-id.helper';
import { arbitraryUserHandle } from '../test/types/user-handle.helper';
import { arbitraryGroup } from '../test/types/group.helper';

describe('authentication-and-redirect', () => {
  const groupA = arbitraryGroup();
  const groupB = arbitraryGroup();
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
    await callApi('api/add-group', {
      ...groupB,
      groupId: groupB.id,
    });
    await callApi('api/record-evaluation', {
      groupId: groupA.id,
      publishedAt: new Date(),
      evaluationLocator: arbitraryReviewId(),
      articleId: 'doi:10.1101/2020.07.13.199174',
      authors: [],
    });
  });

  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when I am logged in', () => {
    beforeEach(async () => {
      await createUserAccountAndLogIn(arbitraryUserId());
    });

    describe('after clicking the Log Out button', () => {
      beforeEach(async () => {
        await click('Log Out');
      });

      it('i am logged out', async () => {
        const buttonText = await $('.utility-bar__list_link_button').text();

        expect(buttonText).toBe('Log In');
      });

      it.todo('clicking the back button doesn\'t result in an error');
    });

    describe('after clicking on the thumbs down button for an evaluation', () => {
      beforeEach(async () => {
        await goto('localhost:8080/articles/10.1101/2020.07.13.199174');
        await click($('.activity-feed__item:first-child button[value="respond-not-helpful"]'));
      });

      it('returns to the review fragment on the article page', async () => {
        const result = await currentURL();

        expect(result).toContain('10.1101/2020.07.13.199174');
        expect(result).toMatch(/.*#[a-z]*:/);
      });
    });

    describe('after clicking on the Follow button', () => {
      beforeEach(async () => {
        await goto(`localhost:8080/groups/${groupB.slug}`);
        await click('Follow');
      });

      it('returns to the group page', async () => {
        const result = await currentURL();

        expect(result).toContain(`/groups/${groupB.slug}`);
      });
    });
  });
});
