/* eslint-disable no-console */
import {
  click, currentURL, goto, openBrowser,
} from 'taiko';
import { arbitraryAddGroupCommand } from '../../test/write-side/commands/add-group-command.helper';
import { arbitraryCreateUserAccountCommand } from '../../test/write-side/commands/create-user-account-command.helper';
import * as api from '../helpers/api-helpers';
import { completeLoginViaStubWithSpecifiedUserId } from '../helpers/complete-login-via-stub-with-specified-user-id';
import { getIdOfFirstListOwnedByUser } from '../helpers/get-first-list-owned-by.helper';
import { isLoggedIn } from '../helpers/is-logged-in';
import { screenshotTeardown } from '../utilities';

describe('single-login', () => {
  const addGroupCommand = arbitraryAddGroupCommand();
  const createUserAccountCommand = arbitraryCreateUserAccountCommand();

  beforeAll(async () => {
    await api.createUser(createUserAccountCommand);
    await api.addGroup(addGroupCommand);
  });

  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe.each([
    ['About page', '/about'],
    ['Article page', '/articles/activity/10.1101/2023.02.09.527915'],
    ['Group page, about tab', `/groups/${addGroupCommand.slug}/about`],
    ['Group followers page', `/groups/${addGroupCommand.slug}/followers`],
    ['Group page, lists tab', `/groups/${addGroupCommand.slug}/lists`],
    ['Groups page', '/groups'],
    ['Home page', '/'],
    ['Legal page', '/legal'],
    ['Sciety feed page', '/sciety-feed'],
    ['Search page', '/search'],
    ['Search results page', '/search?category=articles&query=covid&evaluatedOnly=true'],
    ['User page, lists tab', `/users/${createUserAccountCommand.handle}/lists`],
    ['User page, following tab', `/users/${createUserAccountCommand.handle}/lists`],
  ])('when I am on the %s and I am not logged in', (name, page) => {
    beforeEach(async () => {
      await goto(`localhost:8080${page}`);
    });

    describe('when I log in', () => {
      beforeEach(async () => {
        await click('Log In');
        await completeLoginViaStubWithSpecifiedUserId(createUserAccountCommand.userId);
      });

      it(`i am still on the ${name}`, async () => {
        const result = await currentURL();

        expect(result).toBe(`http://localhost:8080${page}`);
      });

      it('i am logged in', async () => {
        expect(await isLoggedIn()).toBe(true);
      });

      it.todo('clicking the back button doesn\'t result in an error');
    });
  });

  describe('when I am on the List page and I am not logged in', () => {
    let page: string;

    beforeEach(async () => {
      page = `/lists/${await getIdOfFirstListOwnedByUser(createUserAccountCommand.userId)}`;
      await goto(`localhost:8080${page}`);
    });

    describe('when I log in', () => {
      beforeEach(async () => {
        await click('Log In');
        await completeLoginViaStubWithSpecifiedUserId(createUserAccountCommand.userId);
      });

      it('i am still on the List page', async () => {
        expect(await currentURL()).toBe(`http://localhost:8080${page}`);
      });

      it('i am logged in', async () => {
        expect(await isLoggedIn()).toBe(true);
      });

      it.todo('clicking the back button doesn\'t result in an error');
    });
  });
});
