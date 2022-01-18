import axios from 'axios';
import dotenv from 'dotenv';
import {
  $, goto, openBrowser,
} from 'taiko';
import { screenshotTeardown } from './utilities';
import * as RI from '../src/types/review-id';
import { arbitraryDate, arbitraryString } from '../test/helpers';
import { arbitraryReviewId } from '../test/types/review-id.helper';

describe('add an article to a list', () => {
  beforeEach(async () => {
    dotenv.config();
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when an article is added to a list via the API', () => {
    const articleId = '10.1101/2021.07.23.453070';
    const listId = '5ac3a439-e5c6-4b15-b109-92928a740812';

    beforeEach(async () => {
      await axios.post(
        'http://localhost:8080/add-article-to-list',
        JSON.stringify({
          articleId,
          listId,
        }),
        {
          headers: {
            Authorization: 'Bearer secret',
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        },
      );
    });

    it.skip('displays the article', async () => {
      await goto(`localhost:8080/lists/${listId}`);
      const articleIsDisplayed = await $(`.article-card__link[href="/articles/activity/${articleId}"]`).exists();

      expect(articleIsDisplayed).toBe(true);
    });
  });
});
