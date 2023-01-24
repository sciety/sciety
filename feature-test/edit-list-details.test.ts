import {
  $, click, closeBrowser, currentURL, goto, into, openBrowser, textBox, write,
} from 'taiko';
import { getFirstListOwnedByUser } from './get-first-list-owned-by.helper';
import { arbitraryString, arbitraryWord } from '../test/helpers';

describe.skip('edit-list-details', () => {
  let listId: string;

  beforeAll(async () => {
    const testUserId = '153571843';
    await openBrowser();
    await goto(`localhost:8080/log-in-as?userId=${testUserId}`);
    listId = await getFirstListOwnedByUser(testUserId);
  });

  afterAll(async () => {
    await closeBrowser();
  });

  describe('editing details through the form page and clicking save', () => {
    const listName = arbitraryWord();
    const listDescription = arbitraryString();

    beforeAll(async () => {
      const listPage = `localhost:8080/lists/${listId}`;
      await goto(listPage);
      const editDetailsLinkSelector = '.page-header__edit_details_link';
      const editDetailsLink = $(editDetailsLinkSelector);
      await click(editDetailsLink);
      await write(listName, into(textBox('List name')));
      await write(listDescription, into(textBox('Description')));

      const editListDetailsButtonSelector = 'form[action="/forms/edit-list-details"] button';
      const saveButton = $(editListDetailsButtonSelector);
      await click(saveButton);
    });

    it('the user is redirected to the list page', async () => {
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
