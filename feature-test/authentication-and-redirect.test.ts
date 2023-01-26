import {
  $, click, currentURL, goBack, goto, link, openBrowser, text, into, write, textBox,
} from 'taiko';
import { arbitraryString, arbitraryWord } from '../test/helpers';
import { arbitraryDescriptionPath } from '../test/types/description-path.helper';
import { arbitraryGroupId } from '../test/types/group-id.helper';
import { arbitraryReviewId } from '../test/types/review-id.helper';
import { callApi } from './call-api.helper';
import { screenshotTeardown } from './utilities';
import { arbitraryUserId } from '../test/types/user-id.helper';
import { arbitraryUserHandle } from '../test/types/user-handle.helper';

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

  it('log in works', async () => {
    await goto(`localhost:8080/log-in-as?userid=${userId}`);
    const result = await link('Log out').exists();

    expect(result).toBe(true);
  });

  describe('not logged in', () => {
    it('save article command returns to the article page after saving the article', async () => {
      await goto('localhost:8080/articles/10.1101/2020.05.01.072975');
      await click('Save to my list');
      await write(userId, into(textBox('User id')));
      await click('Log in');
      const result = await text('Saved to my list').exists();

      expect(result).toBe(true);
    });

    it('log in from the article page returns to the article page', async () => {
      await goto('localhost:8080/articles/10.1101/2020.07.13.199174');
      await click('Log in');
      await write(userId, into(textBox('User id')));
      await click('Log in');

      const result = await currentURL();

      expect(result).toContain('/articles/activity/10.1101/2020.07.13.199174');
    });

    it('respond command returns to review fragment on the article page', async () => {
      await goto('localhost:8080/articles/10.1101/2020.07.13.199174');
      await click($('.activity-feed__item:first-child button[value="respond-helpful"]'));
      await write(userId, into(textBox('User id')));
      await click('Log in');

      const result = await currentURL();

      expect(result).toContain('10.1101/2020.07.13.199174');
      expect(result).toMatch(/.*#[a-z]*:/);
    });

    it('follow command from the group page returns to the group page', async () => {
      await goto(`localhost:8080/groups/${groupASlug}`);
      await click('Follow');
      await write(userId, into(textBox('User id')));
      await click('Log in');

      const result = await currentURL();

      expect(result).toContain(`/groups/${groupASlug}`);
    });

    it('completing the sign up journey returns to the home page', async () => {
      await goto('localhost:8080/groups');
      await click('Sign Up');
      await click('Sign up with your Twitter account');
      await write(userId, into(textBox('User id')));
      await click('Log in');

      const result = await currentURL();

      expect(result).toBe('http://localhost:8080/?login_success=twitter');
    });
  });

  describe('logged in', () => {
    beforeEach(async () => {
      await goto('localhost:8080/');
      await click('Log in');
      await write(userId, into(textBox('User id')));
      await click('Log in');
    });

    it('log out from the article page returns to the article page', async () => {
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
