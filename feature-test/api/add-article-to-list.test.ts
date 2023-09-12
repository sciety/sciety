import {
  $, goto, openBrowser,
} from 'taiko';
import { getIdOfFirstListOwnedByGroup } from '../helpers/get-first-list-owned-by.helper';
import { screenshotTeardown } from '../utilities';
import { arbitraryGroup } from '../../test/types/group.helper';
import * as api from '../helpers/api-helpers';
import { arbitraryArticleId } from '../../test/types/article-id.helper';
import { ListId } from '../../src/types/list-id';

describe('add an article to a list', () => {
  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when an article is added to a list via the API', () => {
    const articleId = arbitraryArticleId();
    let listId: ListId;

    beforeEach(async () => {
      const group = arbitraryGroup();
      await api.addGroup(group);
      listId = await getIdOfFirstListOwnedByGroup(group.id);
      await api.addArticleToList(articleId, listId);
    });

    it('displays the article', async () => {
      await goto(`localhost:8080/lists/${listId}`);
      const articleIsDisplayed = await $(`.article-card [href="/articles/activity/${articleId.value}"]`).exists();

      expect(articleIsDisplayed).toBe(true);
    });
  });
});
