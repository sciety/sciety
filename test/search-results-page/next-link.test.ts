import * as O from 'fp-ts/Option';
import { JSDOM } from 'jsdom';
import { nextLink } from '../../src/search-results-page/next-link';

describe('next-link', () => {
  it('encodes the cursor for http', () => {
    const nextLinkAnchor = nextLink({
      pageNumber: 2,
      category: 'articles',
      query: 'bats',
      nextCursor: O.some('foo+/bar'),
    });

    const rendered = JSDOM.fragment(nextLinkAnchor);
    const linkHref = rendered.querySelector('a')?.getAttribute('href');

    const expectedHref = '/search?query=bats&category=articles&cursor=foo%2B%2Fbar&page=2';

    expect(linkHref).toStrictEqual(expectedHref);
  });

  it('encodes the query for http', () => {
    const nextLinkAnchor = nextLink({
      pageNumber: 2,
      category: 'articles',
      query: 'bats+bugs',
      nextCursor: O.some('foo'),
    });

    const rendered = JSDOM.fragment(nextLinkAnchor);
    const linkHref = rendered.querySelector('a')?.getAttribute('href');

    const expectedHref = '/search?query=bats%2Bbugs&category=articles&cursor=foo&page=2';

    expect(linkHref).toStrictEqual(expectedHref);
  });
});
