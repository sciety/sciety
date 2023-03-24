import {
  $, click, currentURL, goto, openBrowser, into, write, textBox, openTab, closeTab,
} from 'taiko';
import { arbitraryArticleId } from '../test/types/article-id.helper';
import { createUserAccountAndLogIn } from './helpers/create-user-account-and-log-in.helper';
import { arbitraryString, arbitraryWord } from '../test/helpers';
import { arbitraryDescriptionPath } from '../test/types/description-path.helper';
import { arbitraryGroupId } from '../test/types/group-id.helper';
import { arbitraryReviewId } from '../test/types/review-id.helper';
import { callApi } from './helpers/call-api.helper';
import { screenshotTeardown } from './utilities';
import { arbitraryUserId } from '../test/types/user-id.helper';
import { arbitraryUserHandle } from '../test/types/user-handle.helper';
import { completeLoginViaStubWithSpecifiedUserId } from './helpers/complete-login-via-stub-with-specified-user-id';
import { UserId } from '../src/types/user-id';
import { UserHandle } from '../src/types/user-handle';
import { getIdOfFirstListOwnedByUser } from './helpers/get-first-list-owned-by.helper';

describe('authentication-and-redirect', () => {
  const groupASlug = arbitraryWord();
  const groupBSlug = arbitraryWord();
  const userId = arbitraryUserId();
  const anotherUserHandle = arbitraryUserHandle();

  beforeAll(async () => {
    const groupId = arbitraryGroupId();
    await callApi('api/create-user', {
      userId,
      handle: anotherUserHandle,
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
    ['About page', '/about'],
    ['Article page', '/articles/activity/10.1101/2023.02.09.527915'],
    ['Group page, about tab', `/groups/${groupASlug}/about`],
    ['Group page, followers tab', `/groups/${groupASlug}/followers`],
    ['Group page, lists tab', `/groups/${groupASlug}/lists`],
    ['Groups page', '/groups'],
    ['Home page', '/'],
    ['Legal page', '/legal'],
    ['Sciety feed page', '/sciety-feed'],
    ['Search page', '/search'],
    ['Search results page', '/search?category=articles&query=covid&evaluatedOnly=true'],
    ['User page, lists tab', `/users/${anotherUserHandle}/lists`],
    ['User page, following tab', `/users/${anotherUserHandle}/lists`],
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

  describe('when I am on the group page and I am not logged in', () => {
    const groupPageAboutTab = `http://localhost:8080/groups/${groupASlug}/about`;

    beforeEach(async () => {
      await goto(groupPageAboutTab);
    });

    describe('when I attempt to follow the group and successfully log in', () => {
      beforeEach(async () => {
        await click('Follow');
        await completeLoginViaStubWithSpecifiedUserId(userId);
      });

      it('i am still on the group page and I am logged in', async () => {
        const result = await currentURL();
        const buttonText = await $('.utility-bar__list_link_button').text();

        expect(result).toBe(groupPageAboutTab);

        expect(buttonText).toBe('Log Out');
      });
    });
  });

  describe('when I start to log in from the article page, but don\'t complete the flow', () => {
    const articleId = '10.1101/2022.09.23.22280264';
    const articlePage = `localhost:8080/articles/activity/${articleId}`;
    const scietyFeedPage = 'localhost:8080/sciety-feed';

    beforeEach(async () => {
      await goto(articlePage);
      await click('Log In');
    });

    describe('when I then complete a log in from the Sciety feed page', () => {
      beforeEach(async () => {
        await goto(scietyFeedPage);
        await click('Log In');
        await completeLoginViaStubWithSpecifiedUserId(userId);
      });

      it('i am still on the Sciety feed page and I am logged in', async () => {
        const result = await currentURL();
        const buttonText = await $('.utility-bar__list_link_button').text();

        expect(result).toBe(`http://${scietyFeedPage}`);
        expect(buttonText).toBe('Log Out');
      });
    });
  });

  describe('when I am on the article page and I log in successfully', () => {
    const articleId = '10.1101/2022.09.23.22280264';
    const articlePage = `localhost:8080/articles/activity/${articleId}`;

    beforeEach(async () => {
      await goto(articlePage);
      await click('Log In');
      await completeLoginViaStubWithSpecifiedUserId(userId);
    });

    describe('when I log out and go to the Sciety feed page', () => {
      const scietyFeedPage = 'localhost:8080/sciety-feed';

      beforeEach(async () => {
        await click('Log out');
        await goto(scietyFeedPage);
      });

      describe('when I log in successfully again', () => {
        beforeEach(async () => {
          await click('Log In');
          await completeLoginViaStubWithSpecifiedUserId(userId);
        });

        it('i am still on the Sciety feed page', async () => {
          const result = await currentURL();

          expect(result).toContain(scietyFeedPage);
        });
      });
    });

    describe('when I log out from another tab', () => {
      beforeEach(async () => {
        await openTab('localhost:8080/');
        await click('Log out');
        await closeTab('http://localhost:8080/');
      });

      describe('when I go back to the original tab and I attempt to save the article', () => {
        beforeEach(async () => {
          // eslint-disable-next-line no-console
          console.log(await currentURL());
          // eslint-disable-next-line no-console
          console.log(await $('body').text());
          await click('Save article');
        });

        describe('when I log back in again', () => {
          beforeEach(async () => {
            await completeLoginViaStubWithSpecifiedUserId(userId);
          });

          it('i am still on the article page', async () => {
            const result = await currentURL();

            expect(result).toContain(articlePage);
          });
        });
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
        await completeLoginViaStubWithSpecifiedUserId(newUserId);
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

    describe('after clicking Log in to save this article', () => {
      const articleId = arbitraryArticleId();
      const articlePage = `localhost:8080/articles/activity/${articleId.value}`;

      beforeEach(async () => {
        await goto(articlePage);
        await click('Log in to save this article');
        await completeLoginViaStubWithSpecifiedUserId(userId);
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
