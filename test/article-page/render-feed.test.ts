import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { renderFeed } from '../../src/article-page/render-feed';
import { Doi } from '../../src/types/doi';
import { EditorialCommunityId } from '../../src/types/editorial-community-id';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { shouldNotBeCalled } from '../should-not-be-called';

describe('render-feed', () => {
  describe('when there are no feed items', () => {
    it('displays nothing', async () => {
      const render = renderFeed(
        () => T.of([]),
        shouldNotBeCalled,
        shouldNotBeCalled,
      );

      const rendered = await render(new Doi('10.1101/12345678'), 'biorxiv', O.none)();

      expect(rendered).toStrictEqual(E.left('no-content'));
    });
  });

  describe('when there are feed items', () => {
    it('returns a list', async () => {
      const render = renderFeed(
        () => T.of([
          {
            type: 'review',
            id: new Doi('10.1111/12345678'),
            source: O.some(new URL('http://example.com')),
            occurredAt: new Date(),
            editorialCommunityId: new EditorialCommunityId(''),
            editorialCommunityName: '',
            editorialCommunityAvatar: '/images/xyz.png',
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

      const rendered = await render(new Doi('10.1101/12345678'), 'biorxiv', O.none)();

      expect(rendered).toStrictEqual(E.right(expect.stringContaining('<ol')));
    });
  });
});
