import { NotFound } from 'http-errors';
import { buildRenderPage } from '../../src/article-page';
import createServer from '../http/server';

describe('create render page', (): void => {
  describe('when the article is from bioRxiv', (): void => {
    it('returns a page containing article metadata', async (): Promise<void> => {
      const { adapters } = await createServer();
      const renderPage = buildRenderPage(adapters);
      const params = { doi: '10.1101/833392' };

      expect(await renderPage(params)).toStrictEqual(expect.stringContaining('10.1101/833392'));
    });
  });

  describe('when the article does not exist', (): void => {
    it('throws a NotFound error', async (): Promise<void> => {
      const { adapters } = await createServer();
      const renderPage = buildRenderPage(adapters);
      const params = { doi: 'rubbish' };
      await expect(renderPage(params)).rejects.toStrictEqual(new NotFound());
    });
  });

  describe('when the article is not from bioRxiv', (): void => {
    it('throws a NotFound error', async (): Promise<void> => {
      const { adapters } = await createServer();
      const renderPage = buildRenderPage(adapters);
      const params = { doi: '10.7554/eLife.09560' };
      await expect(renderPage(params)).rejects.toStrictEqual(new NotFound());
    });
  });
});
