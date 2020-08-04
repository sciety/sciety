import buildRenderPage from '../../src/home-page';
import createServer from '../http/server';

describe('create render page', (): void => {
  it('lists all of the hard-coded editorial communities', async (): Promise<void> => {
    const { adapters } = await createServer();
    const renderPage = buildRenderPage(adapters);

    const rendered = await renderPage();
    for (const ec of adapters.editorialCommunities.all()) {
      expect(rendered).toContain(ec.name);
    }
  });
});
