import {
  $, goto, openBrowser,
} from 'taiko';
import { callApi } from './call-api.helper';
import { screenshotTeardown } from './utilities';

describe('remove an article from a list', () => {
  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when an article is removed from a list via the API', () => {
    const articleId = '10.1101/813451';
    const listId = '5498e813-ddad-414d-88df-d1f84696cecd';

    beforeEach(async () => {
      await callApi('add-article-to-list', { articleId, listId });
      await callApi('remove-article-from-list', { articleId, listId });
    });

    it('does not display the article', async () => {
      await goto(`localhost:8080/lists/${listId}`);
      const articleIsDisplayed = await $(`.article-card__link[href="/articles/activity/${articleId}"]`).exists();

      expect(articleIsDisplayed).toBe(false);
    });
  });
});
