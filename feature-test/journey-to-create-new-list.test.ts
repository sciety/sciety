import {
  click, goto, into, openBrowser, textBox, write, $, currentURL,
} from 'taiko';
import { UserHandle } from '../src/types/user-handle';
import { arbitraryString, arbitraryWord } from '../test/helpers';
import { arbitraryUserHandle } from '../test/types/user-handle.helper';
import { arbitraryUserId } from '../test/types/user-id.helper';
import { callApi } from './helpers/call-api.helper';
import { screenshotTeardown } from './utilities';
import { logInWithSpecifiedUserId } from './helpers/log-in-with-specified-user-id.helper';
import { UserId } from '../src/types/user-id';

describe('journey-to-create-new-list', () => {
  describe('when the user is on their My Lists page', () => {
    let userId: UserId;
    let userHandle: UserHandle;

    beforeEach(async () => {
      userId = arbitraryUserId();
      userHandle = arbitraryUserHandle();
      await callApi('api/create-user', {
        userId,
        handle: userHandle,
        avatarUrl: 'http://somethingthatproducesa404',
        displayName: arbitraryString(),
      });
      await openBrowser();
      await goto('localhost:8080/');
      await click('Log in');
      await logInWithSpecifiedUserId(userId);
      await click('My Lists');
    });

    afterEach(screenshotTeardown);

    describe('when they create a new list', () => {
      let listName: string;

      beforeEach(async () => {
        await click('Create new list');
        listName = arbitraryWord();
        const listDescription = arbitraryString();
        await write(listName, into(textBox('List name')));
        await write(listDescription, into(textBox('Description')));

        const editListDetailsButtonSelector = 'form[action="/forms/edit-list-details"] button';
        const saveButton = $(editListDetailsButtonSelector);
        await click(saveButton);
      });

      it('they end up on the My Lists page with a new list, and a customized name and a description', async () => {
        const finalPage = await currentURL();
        const finalPageContent = await $('main').text();

        expect(finalPage).toContain(`/users/${userHandle}/lists`);
        expect(finalPageContent).toContain(listName);
      });
    });
  });
});
