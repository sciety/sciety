import buildRenderPage from '../../src/home-page';
import FollowList from '../../src/types/follow-list';
import createServer from '../http/server';

describe('create render page', (): void => {
  it('lists all of the hard-coded editorial communities', async (): Promise<void> => {
    const { adapters } = await createServer();
    const renderPage = buildRenderPage(adapters);
    const followList = new FollowList([]);

    const rendered = await renderPage({ followList });
    const allCommunities = await adapters.editorialCommunities.all();
    for (const ec of allCommunities) {
      expect(rendered).toContain(ec.name);
    }
  });
});
