import {
  click, goto, openBrowser,
} from 'taiko';
import { screenshotTeardown } from './utilities';

describe('save-article-to-generic-list', () => {
  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when logged in', () => {
    beforeEach(async () => {
      await goto('localhost:8080/');
      await click('Log in');
    });

    describe('when the user saves the article', () => {
      it.todo('the article should appear in the user\'s generic list page');
    });
  });
});
