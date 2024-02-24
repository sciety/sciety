import {
  $, goto, openBrowser,
} from 'taiko';
import { getIdOfFirstListOwnedByGroup } from '../helpers/get-first-list-owned-by.helper.js';
import { screenshotTeardown } from '../utilities.js';
import * as api from '../helpers/api-helpers.js';
import { arbitraryArticleId } from '../../test/types/article-id.helper.js';
import { ListId } from '../../src/types/list-id.js';
import { arbitraryAddGroupCommand } from '../../test/write-side/commands/add-group-command.helper.js';

describe('add an article to a list', () => {
  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when an article is added to a list via the API', () => {
    const articleId = arbitraryArticleId();
    let listId: ListId;

    beforeEach(async () => {
      const command = arbitraryAddGroupCommand();
      await api.addGroup(command);
      listId = await getIdOfFirstListOwnedByGroup(command.groupId);
      await api.addArticleToList(articleId, listId);
    });

    it('displays the article', async () => {
      await goto(`localhost:8080/lists/${listId}`);
      const articleIsDisplayed = await $(`.article-card [href="/articles/activity/${articleId.value}"]`).exists();

      expect(articleIsDisplayed).toBe(true);
    });
  });
});
