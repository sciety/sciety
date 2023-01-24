import {
  $, click, closeBrowser, goto, into, openBrowser, textBox, write,
} from 'taiko';

describe('auth0 authentication journeys', () => {
  describe('sign up', () => {
    describe('after successfully completing the sign up journey', () => {
      describe('i am logged in', () => {
        beforeAll(async () => {
          await openBrowser();
          await goto('localhost:8080/sign-up-auth0');
          await write('Full Name', into(textBox('Display name')));
          await write('username', into(textBox('Handle')));
          const createAccountButton = $('#createAccountButton');
          await click(createAccountButton);
        });

        afterAll(async () => {
          await closeBrowser();
        });

        it('the login button says "Log Out"', async () => {
          const buttonText = await $('.utility-bar__list_link_button').text();

          expect(buttonText).toBe('Log Out');
        });

        it.todo('i can navigate to my lists from the nav bar');

        it.todo('i can see my handle in the nav bar');

        it.todo('i can see my avatar in the nav bar');

        it.todo('i am on the home page');
      });
    });
  });

  describe('log in', () => {
    describe('given that I have signed up successfully and am logged out', () => {
      describe('when I log in', () => {
        describe('i am logged in', () => {
          it.todo('the login button says "Log out"');

          it.todo('i can navigate to my lists from the nav bar');

          it.todo('i can see my handle in the nav bar');

          it.todo('i can see my avatar in the nav bar');

          it.todo('i am on the home page');
        });
      });
    });
  });

  describe('log out', () => {
    describe('given that I have signed up successfully and am logged in', () => {
      describe('when I log out', () => {
        it.todo('the login button says "Log in"');

        it.todo('my lists do not appear in the nav bar');

        it.todo('my handle is not in the nav bar');

        it.todo('my avatar is not in the nav bar');

        it.todo('i am on the home page');
      });
    });
  });
});
