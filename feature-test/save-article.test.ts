import {
  $, below, click, goto, openBrowser, text,
} from 'taiko';
import { screenshotTeardown } from './utilities';

describe('save-article', () => {
  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when not logged in', () => {
    it('saves the article to the list', async () => {
      await goto('localhost:8080/articles/10.1101/2020.05.01.072975');
      await click('Save to my list');
      const result = await text('Saved to my list').exists();

      expect(result).toBe(true);
    });
  });

  describe('when logged in', () => {
    beforeEach(async () => {
      await goto('localhost:8080/');
      await click('Log in');
    });

    it('saves the article to the list', async () => {
      await goto('localhost:8080/articles/10.1101/265348');
      await click('Save to my list');
      const result = await text('Saved to my list').exists();

      expect(result).toBe(true);
    });
  });
});

describe('unsave article', () => {
  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when logged in', () => {
    beforeEach(async () => {
      await goto('localhost:8080/');
      await click('Log in');
    });

    const doi = '10.1101/2021.02.16.431437';

    it('removes the article from the list', async () => {
      await goto(`localhost:8080/articles/${doi}`);
      await click('Save to my list');
      await click('Saved to my list');
      await click('Saved articles');
      await click(
        $('.article-card button'),
        below($(`.article-card__link[href="/articles/activity/${doi}"]`)),
      );
      await goto(`localhost:8080/articles/${doi}`);
      const result = await text('Save to my list').exists();

      expect(result).toBe(true);
    });
  });
});
