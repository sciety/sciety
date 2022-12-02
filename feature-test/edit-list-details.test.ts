import {
  $, click, closeBrowser, goto, into, openBrowser, textBox, write,
} from 'taiko';
import { getFirstListOwnedBy } from './get-first-list-owned-by.helper';
import { arbitraryWord } from '../test/helpers';

describe('edit-list-details', () => {
  let listId: string;

  beforeAll(async () => {
    const testUserId = '153571843';
    await openBrowser();
    await goto(`localhost:8080/log-in-as?userId=${testUserId}`);
    listId = await getFirstListOwnedBy(testUserId);
    const editListDetailsPage = `localhost:8080/lists/${listId}/edit-details`;
    await goto(editListDetailsPage);
  });

  afterAll(async () => {
    await closeBrowser();
  });

  describe('providing a new value into the name field and clicking save', () => {
    it.failing('the list is renamed with the new value', async () => {
      const listName = arbitraryWord();
      await write(listName, into(textBox('List name')));
      const editListDetailsButtonSelector = 'form[action="/forms/edit-list-details"] button';
      const saveButton = $(editListDetailsButtonSelector);
      await click(saveButton);

      const listPage = `localhost:8080/lists/${listId}`;
      await goto(listPage);

      const pageTitle = await $('h1').text();

      expect(pageTitle).toContain(listName);
    });
  });
});
