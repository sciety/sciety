import {
  $, click, currentURL, goBack, goto, link, openBrowser,
} from 'taiko';
import { screenshotTeardown } from './utilities';

describe('authentication-and-redirect', () => {
  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  it('log in works', async () => {
    await goto('localhost:8080');
    await click('Log in');
    const result = await link('Log out').exists();

    expect(result).toBe(true);
  });

  describe('not logged in', () => {
    it('log in from the article page returns to the article page', async () => {
      await goto('localhost:8080/articles/10.1101/2020.07.13.199174');
      await click('Log in');

      const result = await currentURL();

      expect(result).toContain('/articles/activity/10.1101/2020.07.13.199174');
    });

    it('respond command returns to review fragment on the article page', async () => {
      await goto('localhost:8080/articles/10.1101/2020.07.13.199174');
      await click($('.activity-feed__item:first-child button[value="respond-helpful"]'));

      const result = await currentURL();

      expect(result).toMatch(/\/articles\/activity\/10\.1101\/2020\.07\.13\.199174#(hypothesis|doi):/);
    });

    it('follow command from the group page returns to the group page', async () => {
      await goto('localhost:8080/groups/4eebcec9-a4bb-44e1-bde3-2ae11e65daaa');
      await click('Follow');

      const result = await currentURL();

      expect(result).toContain('/groups/pci-animal-science');
    });

    it('completing the sign up journey returns to the home page', async () => {
      await goto('localhost:8080/groups');
      await click('Sign Up');
      await click('Sign up with your Twitter account');

      const result = await currentURL();

      expect(result).toBe('http://localhost:8080/?login_success=twitter');
    });
  });

  describe('logged in', () => {
    beforeEach(async () => {
      await goto('localhost:8080/');
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

      expect(result).toMatch(/\/articles\/activity\/10\.1101\/2020\.07\.13\.199174#(hypothesis|doi):/);
    });

    it('follow command from the group page returns to the group page', async () => {
      await goto('localhost:8080/groups/10360d97-bf52-4aef-b2fa-2f60d319edd7');
      await click('Follow');

      const result = await currentURL();

      expect(result).toContain('/groups/prereview');
    });

    it('back button doesn\'t break authentication', async () => {
      await goBack();

      const result = await currentURL();

      expect(result).not.toContain('/twitter/callback');
    });
  });
});
