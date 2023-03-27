/* eslint-disable no-console */
import {
  $, click, currentURL, goto, openBrowser,
} from 'taiko';
import { screenshotTeardown } from '../utilities';
import { completeLoginViaStubWithSpecifiedUserId } from '../helpers/complete-login-via-stub-with-specified-user-id';
import { getIdOfFirstListOwnedByUser } from '../helpers/get-first-list-owned-by.helper';
import { arbitraryGroup } from '../../test/types/group.helper';
import * as api from '../helpers/api-helpers';
import { arbitraryUserDetails } from '../../test/types/user-details.helper';

describe('single-login', () => {
  const groupA = arbitraryGroup();
  const userDetails = arbitraryUserDetails();

  beforeAll(async () => {
    await api.createUser(userDetails);
    await api.addGroup(groupA);
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
    ['Sciety feed page', '/sciety-feed'],
    ['Search page', '/search'],
    ['Search results page', '/search?category=articles&query=covid&evaluatedOnly=true'],
    ['User page, lists tab', `/users/${userDetails.handle}/lists`],
    ['User page, following tab', `/users/${userDetails.handle}/lists`],
  ])('when I am on the %s and I am not logged in', (name, page) => {
    beforeEach(async () => {
      await goto(`localhost:8080${page}`);
    });

    describe('when I log in', () => {
      beforeEach(async () => {
        await click('Log In');
        await completeLoginViaStubWithSpecifiedUserId(userDetails.id);
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
      page = `/lists/${await getIdOfFirstListOwnedByUser(userDetails.id)}`;
      await goto(`localhost:8080${page}`);
    });

    describe('when I log in', () => {
      beforeEach(async () => {
        await click('Log In');
        await completeLoginViaStubWithSpecifiedUserId(userDetails.id);
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
