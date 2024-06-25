import {
  $, goto, openBrowser,
} from 'taiko';
import { ArticleId } from '../../src/types/article-id';
import { ListId } from '../../src/types/list-id';
import { arbitraryExpressionDoi } from '../../test/types/expression-doi.helper';
import { arbitraryAddGroupCommand } from '../../test/write-side/commands/add-group-command.helper';
import * as api from '../helpers/api-helpers';
import { getIdOfFirstListOwnedByGroup } from '../helpers/get-first-list-owned-by.helper';
import { screenshotTeardown } from '../utilities';

describe('add an article to a list', () => {
  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when an article is added to a list via the API', () => {
    const articleId = new ArticleId(arbitraryExpressionDoi());
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
