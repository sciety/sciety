import { URL } from 'url';
import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { createRenderFeed } from '../../src/article-page/render-feed';
import { Doi } from '../../src/types/doi';
import { EditorialCommunityId } from '../../src/types/editorial-community-id';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { shouldNotBeCalled } from '../should-not-be-called';

describe('render-feed', () => {
  describe('when there are no feed items', () => {
    it('displays nothing', async () => {
      const renderFeed = createRenderFeed(
        () => T.of([]),
        shouldNotBeCalled,
        shouldNotBeCalled,
      );

      const rendered = await renderFeed(new Doi('10.1101/12345678'), 'biorxiv', O.none)();

      expect(rendered).toStrictEqual(E.left('no-content'));
    });
  });

  describe('when there are feed items', () => {
    it('returns a list', async () => {
      const renderFeed = createRenderFeed(
        () => T.of([
          {
            type: 'review',
            id: new Doi('10.1111/12345678'),
            source: new URL('http://example.com'),
            occurredAt: new Date(),
            editorialCommunityId: new EditorialCommunityId(''),
            editorialCommunityName: '',
            editorialCommunityAvatar: new URL('http://example.com'),
            fullText: O.none,
          },
          {
            type: 'article-version',
            source: new URL('http://example.com'),
            occurredAt: new Date(),
            version: 1,
            server: 'biorxiv',
          },
          {
            type: 'article-version-error',
            server: 'biorxiv',
          },
        ]),
        () => T.of(toHtmlFragment('')),
        () => toHtmlFragment(''),
      );

      const rendered = await renderFeed(new Doi('10.1101/12345678'), 'biorxiv', O.none)();

      expect(rendered).toStrictEqual(E.right(expect.stringContaining('<ol')));
    });
  });
});
