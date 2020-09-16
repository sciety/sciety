import createRenderHeader, { GetEditorialCommunity } from '../../src/editorial-community-page/render-page-header';
import EditorialCommunityId from '../../src/types/editorial-community-id';

describe('create render page', (): void => {
  describe('when the community exists', (): void => {
    it('renders the community name', async (): Promise<void> => {
      const getCommunity: GetEditorialCommunity = async () => ({
        name: 'My Community',
        avatarUrl: 'http://example.com',
      });
      const renderHeader = createRenderHeader(getCommunity);
      const rendered = await renderHeader(new EditorialCommunityId('no-such-community'));

      expect(rendered).toStrictEqual(expect.stringContaining('My Community'));
    });
  });
});
