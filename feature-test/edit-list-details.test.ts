import {
  $, click, closeBrowser, currentURL, goto, into, openBrowser, textBox, write,
} from 'taiko';
import { getFirstListOwnedByUser } from './get-first-list-owned-by.helper';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../test/helpers';
import { arbitraryUserId } from '../test/types/user-id.helper';
import { UserId } from '../src/types/user-id';
import { arbitraryUserHandle } from '../test/types/user-handle.helper';
import { callApi } from './call-api.helper';

const createUserAccountAndLogIn = async (userId: UserId) => {
  await callApi('api/create-user', {
    userId,
    handle: arbitraryUserHandle(),
    avatarUrl: arbitraryUri(),
    displayName: arbitraryString(),
  });
  await goto('localhost:8080/');
  await click('Log In');
  await write(userId, into(textBox('User id')));
  await click('Log in');
};

describe('edit-list-details', () => {
  let listId: string;

  beforeAll(async () => {
    const testUserId = arbitraryUserId();
    await openBrowser();
    await createUserAccountAndLogIn(testUserId);
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
