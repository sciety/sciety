import buildRenderPage from '../../src/article-search-page';
import createServer from '../http/server';

describe('create render page', (): void => {
  it('displays search results', async (): Promise<void> => {
    const { adapters } = await createServer();
    const renderPage = buildRenderPage(adapters);
    const params = { query: '10.1101/833392' };

    const page = await renderPage(params);

    expect(page.isOk()).toBe(true);
    expect(page.unsafelyUnwrap().content).toStrictEqual(expect.stringContaining('Search results'));
  });
});
