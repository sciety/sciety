import {
  $, click, closeBrowser, currentURL, goto, into, openBrowser, textBox, write,
} from 'taiko';
import { getFirstListOwnedBy } from './get-first-list-owned-by.helper';
import { arbitraryString, arbitraryWord } from '../test/helpers';

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

  describe('providing new values into the name and description fields and clicking save', () => {
    const listName = arbitraryWord();
    const listDescription = arbitraryString();

    beforeAll(async () => {
      await write(listName, into(textBox('List name')));
      await write(listDescription, into(textBox('Description')));

      const editListDetailsButtonSelector = 'form[action="/forms/edit-list-details"] button';
      const saveButton = $(editListDetailsButtonSelector);
      await click(saveButton);
    });

    it.failing('the user is redirected to the list page', async () => {
      const currentPage = await currentURL();

      expect(currentPage).toBe(`http://localhost:8080/lists/${listId}`);
    });

    it('the list name is renamed with the new value', async () => {
      await goto(`localhost:8080/lists/${listId}`);
      const pageTitle = await $('h1').text();

      expect(pageTitle).toContain(listName);
    });

    it('the list description is updated with the new value', async () => {
      await goto(`localhost:8080/lists/${listId}`);
      const listDescriptionFromPage = await $('.page-header__description').text();

      expect(listDescriptionFromPage).toContain(listDescription);
    });
  });
});
