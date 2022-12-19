/* eslint-disable jest/no-standalone-expect */
import {
  $,
  click, closeBrowser,
  goto,
  openBrowser,
} from 'taiko';
import { getFirstListOwnedBy } from '../get-first-list-owned-by.helper';

describe('add-previously-removed-article-to-list', () => {
  const testUserId = '1384541806231175172';
  const articleId = '10.1101/2021.07.28.454225';

  beforeAll(async () => {
    await openBrowser();
    await goto(`localhost:8080/log-in-as?userId=${testUserId}`);

    await goto(`localhost:8080/articles/${articleId}`);
    await click('Save to my list');
    // check the save button has changed to indicate the article has been saved
    const contentSelector = '.article-actions';
    const content = await $(contentSelector).text();

    expect(content).toContain('Saved to my list');

    // go to list page
    const listId = await getFirstListOwnedBy(testUserId);
    const userListPageUrl = `localhost:8080/lists/${listId}`;
    await goto(userListPageUrl);

    // delete previously saved article from list
    const articleCardDeleteButtonSelector = '.article-card form[action="/forms/remove-article-from-list"]';
    const deleteButton = $(articleCardDeleteButtonSelector);
    await click(deleteButton);

    // go to the specific article
    await goto(`localhost:8080/articles/${articleId}`);
    // click the save button
    await click('Save to my list');
    // check the save button has changed to indicate the article has been saved
  });

  afterAll(async () => {
    await closeBrowser();
  });

  it('saves the article again', async () => {
    const contentSelector = '.article-actions';
    const content = await $(contentSelector).text();

    expect(content).toContain('Saved to my list');
  });
});
