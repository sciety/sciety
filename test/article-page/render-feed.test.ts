import { URL } from 'url';
import createRenderFeed from '../../src/article-page/render-feed';
import Doi from '../../src/types/doi';
import EditorialCommunityId from '../../src/types/editorial-community-id';
import shouldNotBeCalled from '../should-not-be-called';

describe('render-feed', () => {
  describe('when there are no reviews', () => {
    it('displays nothing', async () => {
      const renderFeed = createRenderFeed(
        async () => [],
        shouldNotBeCalled,
      );

      const rendered = await renderFeed(new Doi('10.1101/12345678'));

      expect(rendered.unsafelyUnwrapErr()).toBe('no-content');
    });
  });

  describe('when there are reviews', () => {
    it('returns a list', async () => {
      const renderFeed = createRenderFeed(
        async () => [
          {
            sourceUrl: new URL('http://example.com'),
            occurredAt: new Date(),
            editorialCommunityId: new EditorialCommunityId(''),
            editorialCommunityName: '',
            editorialCommunityAvatar: new URL('http://example.com'),
            details: '',
          },
        ],
        () => '',
      );

      const rendered = await renderFeed(new Doi('10.1101/12345678'));

      expect(rendered.unsafelyUnwrap()).toContain('<ol');
    });
  });
});
