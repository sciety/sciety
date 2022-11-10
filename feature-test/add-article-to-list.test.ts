import {
  $, goto, openBrowser,
} from 'taiko';
import { callApi } from './call-api.helper';
import { screenshotTeardown } from './utilities';

describe('add an article to a list', () => {
  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when an article is added to a list via the API', () => {
    const articleId = '10.1101/813451';
    const listId = '5ac3a439-e5c6-4b15-b109-92928a740812';

    beforeEach(async () => {
      await callApi('api/add-article-to-list', { articleId, listId });
    });

    it('displays the article', async () => {
      await goto(`localhost:8080/lists/${listId}`);
      const articleIsDisplayed = await $(`.article-card__link[href="/articles/activity/${articleId}"]`).exists();

      expect(articleIsDisplayed).toBe(true);
    });
  });
});
