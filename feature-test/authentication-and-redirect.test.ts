import {
  $, click, currentURL, goBack, goto, openBrowser, text, into, write, textBox,
} from 'taiko';
import { arbitraryString, arbitraryWord } from '../test/helpers';
import { arbitraryDescriptionPath } from '../test/types/description-path.helper';
import { arbitraryGroupId } from '../test/types/group-id.helper';
import { arbitraryReviewId } from '../test/types/review-id.helper';
import { callApi } from './helpers/call-api.helper';
import { screenshotTeardown } from './utilities';
import { arbitraryUserId } from '../test/types/user-id.helper';
import { arbitraryUserHandle } from '../test/types/user-handle.helper';
import { logInWithSpecifiedUserId } from './helpers/log-in-with-specified-user-id.helper';

describe('authentication-and-redirect', () => {
  const groupASlug = arbitraryWord();
  const groupBSlug = arbitraryWord();
  const userId = arbitraryUserId();

  beforeAll(async () => {
    const groupId = arbitraryGroupId();
    await callApi('api/create-user', {
      userId,
      handle: arbitraryUserHandle(),
      avatarUrl: 'http://somethingthatproducesa404',
      displayName: arbitraryString(),
    });
    await callApi('api/add-group', {
      groupId,
      name: arbitraryString(),
      shortDescription: arbitraryString(),
      homepage: arbitraryString(),
      avatarPath: 'http://somethingthatproducesa404',
      descriptionPath: arbitraryDescriptionPath(),
      slug: arbitraryWord(),
    });
    await callApi('api/record-evaluation', {
      groupId,
      publishedAt: new Date(),
      evaluationLocator: arbitraryReviewId(),
      articleId: 'doi:10.1101/2020.07.13.199174',
      authors: [],
    });
    await callApi('api/add-group', {
      groupId: arbitraryGroupId(),
      name: arbitraryString(),
      shortDescription: arbitraryString(),
      homepage: arbitraryString(),
      avatarPath: 'http://somethingthatproducesa404',
      descriptionPath: arbitraryDescriptionPath(),
      slug: groupASlug,
    });
    await callApi('api/add-group', {
      groupId: arbitraryGroupId(),
      name: arbitraryString(),
      shortDescription: arbitraryString(),
      homepage: arbitraryString(),
      avatarPath: 'http://somethingthatproducesa404',
      descriptionPath: arbitraryDescriptionPath(),
      slug: groupBSlug,
    });
  });

  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('on completing the sign up journey', () => {
    beforeEach(async () => {
      const newUserId = arbitraryUserId();
      await goto('localhost:8080/groups');
      await click('Sign Up');
      await logInWithSpecifiedUserId(newUserId);
      await write('Full Name', into(textBox('Display name')));
      await write(arbitraryUserHandle(), into(textBox('Handle')));
      const createAccountButton = $('#createAccountButton');
      await click(createAccountButton);
    });

    it('returns to the home page', async () => {
      const result = await text('The home of public preprint evaluation').exists();

      expect(result).toBe(true);
    });

    it('the login button says "Log Out"', async () => {
      const buttonText = await $('.utility-bar__list_link_button').text();

      expect(buttonText).toBe('Log Out');
    });

    it('i can navigate to my lists from the nav bar', async () => {
      await click('My lists');
      const result = await currentURL();

      expect(result).toContain('/users');
    });

    it.todo('i can see my handle in the nav bar');

    it.todo('i can see my avatar in the nav bar');

    it.todo('i am on the home page');
  });

  describe('when logged in', () => {
    beforeEach(async () => {
      await goto('localhost:8080/');
      await click('Log in');
      await logInWithSpecifiedUserId(userId);
    });

    it.todo('the login button says "Log out"');

    it.todo('i can navigate to my lists from the nav bar');

    it.todo('i can see my handle in the nav bar');

    it.todo('i can see my avatar in the nav bar');

    it.todo('i am on the home page');

    describe('after clicking the Log Out button', () => {
      it.todo('the log in button says Log In');

      it.todo('my lists do not appear in the nav bar');

      it.todo('my handle is not in the nav bar');

      it.todo('my avatar is not in the nav bar');

      it.todo('i am on the home page');
    });

    it.skip('log out from the article page returns to the article page', async () => {
      await goto('localhost:8080/articles/10.1101/2020.07.13.199174');
      await click('Log out');

      const result = await currentURL();

      expect(result).toContain('/articles/activity/10.1101/2020.07.13.199174');
    });

    it('respond command returns to review fragment on the article page', async () => {
      await goto('localhost:8080/articles/10.1101/2020.07.13.199174');
      await click($('.activity-feed__item:first-child button[value="respond-not-helpful"]'));

      const result = await currentURL();

      expect(result).toContain('10.1101/2020.07.13.199174');
      expect(result).toMatch(/.*#[a-z]*:/);
    });

    it('follow command from the group page returns to the group page', async () => {
      await goto(`localhost:8080/groups/${groupBSlug}`);
      await click('Follow');

      const result = await currentURL();

      expect(result).toContain(`/groups/${groupBSlug}`);
    });

    it('back button doesn\'t break authentication', async () => {
      await goBack();

      const result = await currentURL();

      expect(result).not.toContain('/twitter/callback');
    });
  });
});
