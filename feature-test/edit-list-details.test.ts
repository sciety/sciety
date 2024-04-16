import {
  $, click, closeBrowser, currentURL, goto, into, openBrowser, textBox, write,
} from 'taiko';
import { createUserAccountAndLogIn } from './helpers/create-user-account-and-log-in.helper';
import { getIdOfFirstListOwnedByUser } from './helpers/get-first-list-owned-by.helper';
import { inputFieldNames } from '../src/standards';
import { arbitraryString, arbitraryWord } from '../test/helpers';
import { arbitraryUserId } from '../test/types/user-id.helper';

describe('edit-list-details', () => {
  let listId: string;

  beforeAll(async () => {
    const testUserId = arbitraryUserId();
    await openBrowser();
    await createUserAccountAndLogIn(testUserId);
    listId = await getIdOfFirstListOwnedByUser(testUserId);
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
      const editDetailsLinkSelector = '.list-page-actions__edit_details_link';
      const editDetailsLink = $(editDetailsLinkSelector);
      await click(editDetailsLink);
      await write(listName, into(textBox({ name: inputFieldNames.listName })));
      await write(listDescription, into(textBox('Description')));

      const editListDetailsButtonSelector = 'form[action="/forms/edit-list-details"] button';
      const saveButton = $(editListDetailsButtonSelector);
      await click(saveButton);
    });

    it.skip('the user is redirected to the list page', async () => {
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
