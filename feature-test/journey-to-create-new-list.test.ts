import {
  click, goto, into, openBrowser, textBox, write, $, currentURL,
} from 'taiko';
import { arbitraryString, arbitraryWord } from '../test/helpers';
import { screenshotTeardown } from './utilities';
import { completeLoginViaStubWithSpecifiedUserId } from './helpers/complete-login-via-stub-with-specified-user-id';
import { UserDetails } from '../src/types/user-details';
import { arbitraryUserDetails } from '../test/types/user-details.helper';
import * as apiHelpers from './helpers/api-helpers';

describe('journey-to-create-new-list', () => {
  describe('when the user is on their My Lists page', () => {
    let userDetails: UserDetails;

    beforeEach(async () => {
      userDetails = arbitraryUserDetails();
      await apiHelpers.createUser(userDetails);
      await openBrowser();
      await goto('localhost:8080/');
      await click('Log in');
      await completeLoginViaStubWithSpecifiedUserId(userDetails.id);
      await click('My Lists');
    });

    afterEach(screenshotTeardown);

    describe('when they create a new list and they provide list details', () => {
      let listName: string;
      let listDescription: string;

      beforeEach(async () => {
        await click('Create new list');
        listName = arbitraryWord();
        listDescription = arbitraryString();
        await write(listName, into(textBox('List name')));
        await write(listDescription, into(textBox('Description')));
        await click('Save');
      });

      it('they end up on the My Lists page with a new list, and a customized name and description', async () => {
        const finalPage = await currentURL();
        const finalPageContent = await $('main').text();

        expect(finalPage).toContain(`/users/${userDetails.handle}/lists`);
        expect(finalPageContent).toContain(listName);
        expect(finalPageContent).toContain(listDescription);
      });
    });

    describe('when they create a new list and they only provide a list name', () => {
      let listName: string;

      beforeEach(async () => {
        await click('Create new list');
        listName = arbitraryWord();
        await write(listName, into(textBox('List name')));
        await click('Save');
      });

      it('they end up on the My Lists page with a new list, and a customized name', async () => {
        const finalPage = await currentURL();
        const finalPageContent = await $('main').text();

        expect(finalPage).toContain(`/users/${userDetails.handle}/lists`);
        expect(finalPageContent).toContain(listName);
      });
    });

    describe('when they create a new list but choose not to edit list details', () => {
      const listName = 'Untitled';

      beforeEach(async () => {
        await click('Create new list');
        await click('Cancel');
      });

      it('they end up on the new list\'s page, and a default name and an empty description', async () => {
        const finalPage = await currentURL();
        const finalPageContent = await $('main').text();

        expect(finalPage).toContain('/lists/');
        expect(finalPageContent).toContain(listName);
      });
    });
  });
});
