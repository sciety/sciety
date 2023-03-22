import {
  $, click, currentURL, goto, openBrowser, into, write, textBox,
} from 'taiko';
import { createUserAccountAndLogIn } from './helpers/create-user-account-and-log-in.helper';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../test/helpers';
import { arbitraryDescriptionPath } from '../test/types/description-path.helper';
import { arbitraryGroupId } from '../test/types/group-id.helper';
import { arbitraryReviewId } from '../test/types/review-id.helper';
import { callApi } from './helpers/call-api.helper';
import { screenshotTeardown } from './utilities';
import { arbitraryUserId } from '../test/types/user-id.helper';
import { arbitraryUserHandle } from '../test/types/user-handle.helper';
import { logInWithSpecifiedUserId } from './helpers/log-in-with-specified-user-id.helper';
import { UserId } from '../src/types/user-id';
import { UserHandle } from '../src/types/user-handle';

describe('authentication-and-redirect', () => {
  const groupASlug = arbitraryWord();
  const groupBSlug = arbitraryWord();
  const userId = arbitraryUserId();

  beforeAll(async () => {
    const groupId = arbitraryGroupId();
    await callApi('api/create-user', {
      userId,
      handle: arbitraryUserHandle(),
      avatarUrl: 'http://somethingthatproducesa404',
      displayName: arbitraryString(),
    });
    await callApi('api/add-group', {
      groupId,
      name: arbitraryString(),
      shortDescription: arbitraryString(),
      homepage: arbitraryString(),
      avatarPath: 'http://somethingthatproducesa404',
      descriptionPath: arbitraryDescriptionPath(),
      slug: arbitraryWord(),
    });
    await callApi('api/record-evaluation', {
      groupId,
      publishedAt: new Date(),
      evaluationLocator: arbitraryReviewId(),
      articleId: 'doi:10.1101/2020.07.13.199174',
      authors: [],
    });
    await callApi('api/add-group', {
      groupId: arbitraryGroupId(),
      name: arbitraryString(),
      shortDescription: arbitraryString(),
      homepage: arbitraryString(),
      avatarPath: 'http://somethingthatproducesa404',
      descriptionPath: arbitraryDescriptionPath(),
      slug: groupASlug,
    });
    await callApi('api/add-group', {
      groupId: arbitraryGroupId(),
      name: arbitraryString(),
      shortDescription: arbitraryString(),
      homepage: arbitraryString(),
      avatarPath: 'http://somethingthatproducesa404',
      descriptionPath: arbitraryDescriptionPath(),
      slug: groupBSlug,
    });
  });

  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe.each([
    ['About page', 'localhost:8080/about'],
    ['Article page', 'localhost:8080/articles/activity/10.1101/2023.02.09.527915'],
    ['Group page, about tab', `localhost:8080/groups/${groupASlug}/about`],
    ['Group page, followers tab', `localhost:8080/groups/${groupASlug}/followers`],
    ['Group page, lists tab', `localhost:8080/groups/${groupASlug}/lists`],
    ['Groups page', 'localhost:8080/groups'],
    ['Home page', 'localhost:8080/'],
    ['Legal page', 'localhost:8080/legal'],
    ['Search page', 'localhost:8080/search'],
    ['Search results page', 'localhost:8080/search?category=articles&query=covid&evaluatedOnly=true'],
  ])('when I am on the %s and I am not logged in', (name, page) => {
    beforeEach(async () => {
      await goto(page);
    });

    describe('when I log in successfully', () => {
      beforeEach(async () => {
        await click('Log In');
        await logInWithSpecifiedUserId(userId);
      });

      it(`i am still on the ${name}`, async () => {
        const result = await currentURL();

        expect(result).toContain(page);
      });
    });
  });

  describe('when I am not logged in', () => {
    describe('on completing the sign up journey', () => {
      let newUserId: UserId;
      let userHandle: UserHandle;

      beforeEach(async () => {
        newUserId = arbitraryUserId();
        userHandle = arbitraryUserHandle();
        await goto('localhost:8080/groups');
        await click('Sign Up');
        await logInWithSpecifiedUserId(newUserId);
        await write('Full Name', into(textBox('Full name')));
        await write(userHandle, into(textBox('Create a handle')));
        const createAccountButton = $('#createAccountButton');
        await click(createAccountButton);
      });

      it('i am logged in', async () => {
        const buttonText = await $('.utility-bar__list_link_button').text();

        expect(buttonText).toBe('Log Out');
      });

      it('the handle I supplied is used for my account', async () => {
        const utilityBar = await $('.utility-bar').text();

        expect(utilityBar).toContain(userHandle);
      });

      it.todo('clicking the back button doesn\'t result in an error');
    });

    describe('after clicking the Log In button', () => {
      let userHandle: UserHandle;
      const userAvatar = arbitraryUri();

      beforeEach(async () => {
        userHandle = arbitraryUserHandle();
        await createUserAccountAndLogIn(arbitraryUserId(), userHandle, userAvatar);
      });

      it('i am logged in', async () => {
        const buttonText = await $('.utility-bar__list_link_button').text();

        expect(buttonText).toBe('Log Out');
      });

      it.todo('clicking the back button doesn\'t result in an error');
    });

    describe('after clicking Log in to save this article', () => {
      let newUserId: UserId;
      let userHandle: UserHandle;
      const articleId = '10.1101/2022.09.23.22280264';
      const articlePage = `localhost:8080/articles/activity/${articleId}`;

      beforeEach(async () => {
        await goto(articlePage);
        await click('Log in to save this article');
        newUserId = arbitraryUserId();
        userHandle = arbitraryUserHandle();
        await goto('localhost:8080/groups');
        await click('Sign Up');
        await logInWithSpecifiedUserId(newUserId);
        await write('Full Name', into(textBox('Full name')));
        await write(userHandle, into(textBox('Create a handle')));
        const createAccountButton = $('#createAccountButton');
        await click(createAccountButton);
      });

      it('i am logged in', async () => {
        const buttonText = await $('.utility-bar__list_link_button').text();

        expect(buttonText).toBe('Log Out');
      });

      it('i am returned to the article page', async () => {
        const result = await currentURL();

        expect(result).toContain(articlePage);
      });
    });
  });

  describe('when I am logged in', () => {
    beforeEach(async () => {
      await createUserAccountAndLogIn(arbitraryUserId());
    });

    describe('after clicking the Log Out button', () => {
      beforeEach(async () => {
        await click('Log Out');
      });

      it('i am logged out', async () => {
        const buttonText = await $('.utility-bar__list_link_button').text();

        expect(buttonText).toBe('Log In');
      });

      it.todo('clicking the back button doesn\'t result in an error');
    });

    describe('after clicking on the thumbs down button for an evaluation', () => {
      beforeEach(async () => {
        await goto('localhost:8080/articles/10.1101/2020.07.13.199174');
        await click($('.activity-feed__item:first-child button[value="respond-not-helpful"]'));
      });

      it('returns to the review fragment on the article page', async () => {
        const result = await currentURL();

        expect(result).toContain('10.1101/2020.07.13.199174');
        expect(result).toMatch(/.*#[a-z]*:/);
      });
    });

    describe('after clicking on the Follow button', () => {
      beforeEach(async () => {
        await goto(`localhost:8080/groups/${groupBSlug}`);
        await click('Follow');
      });

      it('returns to the group page', async () => {
        const result = await currentURL();

        expect(result).toContain(`/groups/${groupBSlug}`);
      });
    });
  });
});
