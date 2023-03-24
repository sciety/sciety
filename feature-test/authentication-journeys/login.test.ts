/* eslint-disable no-console */
import {
  $, click, currentURL, goto, openBrowser,
} from 'taiko';
import { arbitraryString } from '../../test/helpers';
import { callApi } from '../helpers/call-api.helper';
import { screenshotTeardown } from '../utilities';
import { arbitraryUserId } from '../../test/types/user-id.helper';
import { arbitraryUserHandle } from '../../test/types/user-handle.helper';
import { completeLoginViaStubWithSpecifiedUserId } from '../helpers/complete-login-via-stub-with-specified-user-id';
import { getIdOfFirstListOwnedByUser } from '../helpers/get-first-list-owned-by.helper';
import { arbitraryGroup } from '../../test/types/group.helper';

describe('login', () => {
  const groupA = arbitraryGroup();
  const userId = arbitraryUserId();
  const existingUserHandle = arbitraryUserHandle();

  beforeAll(async () => {
    await callApi('api/create-user', {
      userId,
      handle: existingUserHandle,
      avatarUrl: 'http://somethingthatproducesa404',
      displayName: arbitraryString(),
    });
    await callApi('api/add-group', {
      ...groupA,
      groupId: groupA.id,
    });
  });

  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe.each([
    ['About page', '/about'],
    ['Article page', '/articles/activity/10.1101/2023.02.09.527915'],
    ['Group page, about tab', `/groups/${groupA.slug}/about`],
    ['Group page, followers tab', `/groups/${groupA.slug}/followers`],
    ['Group page, lists tab', `/groups/${groupA.slug}/lists`],
    ['Groups page', '/groups'],
    ['Home page', '/'],
    ['Legal page', '/legal'],
    // the page has a bug: it does not work on a database without any evaluations
    // ['Sciety feed page', '/sciety-feed'],
    ['Search page', '/search'],
    ['Search results page', '/search?category=articles&query=covid&evaluatedOnly=true'],
    ['User page, lists tab', `/users/${existingUserHandle}/lists`],
    ['User page, following tab', `/users/${existingUserHandle}/lists`],
  ])('when I am on the %s and I am not logged in', (name, page) => {
    beforeEach(async () => {
      await goto(`localhost:8080${page}`);
    });

    describe('when I log in', () => {
      beforeEach(async () => {
        await click('Log In');
        await completeLoginViaStubWithSpecifiedUserId(userId);
      });

      it(`i am still on the ${name} and I am logged in`, async () => {
        const result = await currentURL();
        const buttonText = await $('.utility-bar__list_link_button').text();

        expect(result).toBe(`http://localhost:8080${page}`);
        expect(buttonText).toBe('Log Out');
      });

      it.todo('clicking the back button doesn\'t result in an error');
    });
  });

  describe('when I am on the List page and I am not logged in', () => {
    let page: string;

    beforeEach(async () => {
      page = `/lists/${await getIdOfFirstListOwnedByUser(userId)}`;
      await goto(`localhost:8080${page}`);
    });

    describe('when I log in', () => {
      beforeEach(async () => {
        await click('Log In');
        await completeLoginViaStubWithSpecifiedUserId(userId);
      });

      it('i am still on the List page and I am logged in', async () => {
        const result = await currentURL();
        const buttonText = await $('.utility-bar__list_link_button').text();

        expect(result).toBe(`http://localhost:8080${page}`);
        expect(buttonText).toBe('Log Out');
      });

      it.todo('clicking the back button doesn\'t result in an error');
    });
  });
});
