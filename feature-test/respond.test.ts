import {
  $, click, goto, openBrowser, text, within,
} from 'taiko';
import { callApi } from './call-api.helper';
import { screenshotTeardown } from './utilities';
import * as GID from '../src/types/group-id';
import { arbitraryArticleId } from '../test/types/article-id.helper';
import { arbitraryReviewId } from '../test/types/review-id.helper';

describe('respond', () => {
  const articleId = arbitraryArticleId();

  beforeEach(async () => {
    await openBrowser();
    await callApi('record-evaluation', {
      groupId: GID.fromValidatedString('4bbf0c12-629b-4bb8-91d6-974f4df8efb2'),
      publishedAt: new Date(),
      evaluationLocator: arbitraryReviewId(),
      articleId: articleId.toString(),
      authors: [],
    });
  });

  afterEach(screenshotTeardown);

  describe('when not logged in', () => {
    it('authenticates via twitter, returns and displays increased response count', async () => {
      await goto(`localhost:8080/articles/${articleId.value}`);
      await click($('.activity-feed__item:first-child button[value="respond-helpful"]'));
      const result = await text('1', within($('.activity-feed__item:first-child button[value="revoke-response"]'))).exists();

      expect(result).toBe(true);
    });
  });
});
