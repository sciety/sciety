import { Maybe } from 'true-myth';
import buildRenderPage, { Params } from '../../src/article-page';
import createServer from '../http/server';

describe('create render page', (): void => {
  describe('when the article is from bioRxiv', (): void => {
    it('returns a page containing article metadata', async (): Promise<void> => {
      const { adapters } = await createServer();
      const renderPage = buildRenderPage(adapters);
      const params: Params = { doi: '10.1101/833392', user: Maybe.nothing() };

      const page = (await renderPage(params)).unsafelyUnwrap();

      expect(page.content).toStrictEqual(expect.stringContaining('10.1101/833392'));
    });
  });

  describe('when the article does not exist', (): void => {
    it('returns a not-found error', async (): Promise<void> => {
      const { adapters } = await createServer();
      const renderPage = buildRenderPage(adapters);
      const params: Params = { doi: 'rubbish', user: Maybe.nothing() };

      const error = (await renderPage(params)).unsafelyUnwrapErr();

      expect(error.type).toBe('not-found');
    });
  });

  describe('when the article is not from bioRxiv', (): void => {
    it('returns a not-found error', async (): Promise<void> => {
      const { adapters } = await createServer();
      const renderPage = buildRenderPage(adapters);
      const params: Params = { doi: '10.7554/eLife.09560', user: Maybe.nothing() };

      const error = (await renderPage(params)).unsafelyUnwrapErr();

      expect(error.type).toBe('not-found');
    });
  });
});
