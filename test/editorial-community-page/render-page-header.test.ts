import { URL } from 'url';
import * as T from 'fp-ts/lib/Task';
import createRenderHeader, { GetEditorialCommunity } from '../../src/editorial-community-page/render-page-header';
import EditorialCommunityId from '../../src/types/editorial-community-id';

describe('create render page', (): void => {
  describe('when the community exists', (): void => {
    it('renders the community name', async (): Promise<void> => {
      const getCommunity: GetEditorialCommunity = () => T.of({
        name: 'My Community',
        avatar: new URL('http://example.com'),
      });
      const renderHeader = createRenderHeader(getCommunity);
      const rendered = await renderHeader(new EditorialCommunityId('arbitrary-id'))();

      expect(rendered).toStrictEqual(expect.stringContaining('My Community'));
    });
  });
});
