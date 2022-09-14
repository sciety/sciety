import {
  $, closeBrowser, goto, openBrowser,
} from 'taiko';

describe('correct-language-semantics', () => {
  beforeAll(async () => {
    await openBrowser();
  });

  afterAll(async () => {
    await closeBrowser();
  });

  describe('in the article page', () => {
    describe('the article title', () => {
      const articleTitleSelector = 'h1 > span:first-child';

      describe('when detected as Portuguese', () => {
        it.todo('is marked up as Portuguese');
      });

      describe('when detected as Spanish', () => {
        it.todo('is marked up as Spanish');
      });

      describe('when detected as English', () => {
        it.skip('is marked up as English', async () => {
          await goto('localhost:8080/articles/activity/10.1101/2020.11.12.379909');
          const languageAttribute = await $(articleTitleSelector).attribute('lang');

          expect(languageAttribute).toBe('en');
        });
      });
    });

    describe('the article abstract', () => {
      describe('when detected as Portuguese', () => {
        it.todo('is marked up as Portuguese');
      });

      describe('when detected as Spanish', () => {
        it.todo('is marked up as Spanish');
      });

      describe('when detected as English', () => {
        it.todo('is marked up as English');
      });
    });
  });

  describe.skip('in the article card', () => {
    it.todo('to be done later');
  });
});
