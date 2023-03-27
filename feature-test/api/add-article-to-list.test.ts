import {
  $, goto, openBrowser,
} from 'taiko';
import { getIdOfFirstListOwnedByGroup } from '../helpers/get-first-list-owned-by.helper';
import { callApi } from '../helpers/call-api.helper';
import { screenshotTeardown } from '../utilities';
import { arbitraryGroup } from '../../test/types/group.helper';
import * as api from '../helpers/api-helpers';

describe('add an article to a list', () => {
  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when an article is added to a list via the API', () => {
    const articleId = '10.1101/813451';
    let listId: string;

    beforeEach(async () => {
      const group = arbitraryGroup();
      await api.addGroup(group);
      listId = await getIdOfFirstListOwnedByGroup(group.id);
      await callApi('api/add-article-to-list', { articleId, listId });
    });

    it('displays the article', async () => {
      await goto(`localhost:8080/lists/${listId}`);
      const articleIsDisplayed = await $(`.article-card__link[href="/articles/activity/${articleId}"]`).exists();

      expect(articleIsDisplayed).toBe(true);
    });
  });
});
