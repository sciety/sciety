import {
  $, goto, openBrowser,
} from 'taiko';
import { arbitraryString, arbitraryUri } from '../../test/helpers';
import { arbitraryDescriptionPath } from '../../test/types/description-path.helper';
import { arbitraryGroupId } from '../../test/types/group-id.helper';
import { callApi } from '../helpers/call-api.helper';
import { getIdOfFirstListOwnedByGroup } from '../helpers/get-first-list-owned-by.helper';
import { screenshotTeardown } from '../utilities';

describe('remove an article from a list', () => {
  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when an article is removed from a list via the API', () => {
    const articleId = '10.1101/813451';
    let listId: string;

    beforeEach(async () => {
      const groupId = arbitraryGroupId();
      await callApi('api/add-group', {
        groupId,
        name: arbitraryString(),
        shortDescription: arbitraryString(),
        homepage: arbitraryString(),
        avatarPath: arbitraryUri(),
        descriptionPath: arbitraryDescriptionPath(),
        slug: arbitraryString(),
        largeLogoPath: arbitraryString(),
      });
      listId = await getIdOfFirstListOwnedByGroup(groupId);
      await callApi('api/add-article-to-list', { articleId, listId });
      await callApi('api/remove-article-from-list', { articleId, listId });
    });

    it('does not display the article', async () => {
      await goto(`localhost:8080/lists/${listId}`);
      const articleIsDisplayed = await $(`.article-card__link[href="/articles/activity/${articleId}"]`).exists();

      expect(articleIsDisplayed).toBe(false);
    });
  });
});
