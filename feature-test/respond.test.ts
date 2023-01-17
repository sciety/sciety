import {
  $, click, goto, openBrowser, text, within,
} from 'taiko';
import { callApi } from './call-api.helper';
import { screenshotTeardown } from './utilities';
import { arbitraryArticleId } from '../test/types/article-id.helper';
import { arbitraryReviewId } from '../test/types/review-id.helper';
import { arbitraryGroupId } from '../test/types/group-id.helper';
import { arbitraryString, arbitraryWord } from '../test/helpers';
import { arbitraryDescriptionPath } from '../test/types/description-path.helper';

describe('respond', () => {
  const articleId = arbitraryArticleId();

  beforeAll(async () => {
    const groupId = arbitraryGroupId();
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
      articleId: articleId.toString(),
      authors: [],
    });
  });

  beforeEach(async () => {
    await openBrowser();
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
