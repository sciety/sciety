import { URL } from 'url';
import * as O from 'fp-ts/lib/Option';
import { Maybe } from 'true-myth';
import createRenderFeed from '../../src/article-page/render-feed';
import { Doi } from '../../src/types/doi';
import { EditorialCommunityId } from '../../src/types/editorial-community-id';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { shouldNotBeCalled } from '../should-not-be-called';

describe('render-feed', () => {
  describe('when there are no feed items', () => {
    it('displays nothing', async () => {
      const renderFeed = createRenderFeed(
        async () => [],
        shouldNotBeCalled,
        shouldNotBeCalled,
      );

      const rendered = await renderFeed(new Doi('10.1101/12345678'), O.none);

      expect(rendered.unsafelyUnwrapErr()).toBe('no-content');
    });
  });

  describe('when there are feed items', () => {
    it('returns a list', async () => {
      const renderFeed = createRenderFeed(
        async () => [
          {
            type: 'review',
            id: new Doi('10.1111/12345678'),
            source: new URL('http://example.com'),
            occurredAt: new Date(),
            editorialCommunityId: new EditorialCommunityId(''),
            editorialCommunityName: '',
            editorialCommunityAvatar: new URL('http://example.com'),
            fullText: Maybe.nothing(),
          },
          {
            type: 'article-version',
            source: new URL('http://example.com'),
            occurredAt: new Date(),
            version: 1,
          },
          {
            type: 'article-version-error',
          },
        ],
        async () => toHtmlFragment(''),
        () => toHtmlFragment(''),
      );

      const rendered = await renderFeed(new Doi('10.1101/12345678'), O.none);

      expect(rendered.unsafelyUnwrap()).toContain('<ol');
    });
  });
});
