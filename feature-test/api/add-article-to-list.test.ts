import {
  $, goto, openBrowser,
} from 'taiko';
import { getFirstListOwnedByGroup } from '../get-first-list-owned-by.helper';
import { arbitraryString } from '../../test/helpers';
import { callApi } from '../call-api.helper';
import { screenshotTeardown } from '../utilities';
import { arbitraryGroupId } from '../../test/types/group-id.helper';
import { arbitraryDescriptionPath } from '../../test/types/description-path.helper';

describe('add an article to a list', () => {
  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when an article is added to a list via the API', () => {
    const articleId = '10.1101/813451';
    let listId: string;

    beforeEach(async () => {
      const groupId = arbitraryGroupId();
      await callApi('api/add-group', {
        groupId,
        name: arbitraryString(),
        shortDescription: arbitraryString(),
        homepage: arbitraryString(),
        avatarPath: 'http://somethingthatproducesa404',
        descriptionPath: arbitraryDescriptionPath(),
        slug: arbitraryString(),
      });
      listId = await getFirstListOwnedByGroup(groupId);
      await callApi('api/add-article-to-list', { articleId, listId });
    });

    it('displays the article', async () => {
      await goto(`localhost:8080/lists/${listId}`);
      const articleIsDisplayed = await $(`.article-card__link[href="/articles/activity/${articleId}"]`).exists();

      expect(articleIsDisplayed).toBe(true);
    });
  });
});
