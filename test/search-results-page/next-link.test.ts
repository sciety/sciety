import * as O from 'fp-ts/Option';
import { JSDOM } from 'jsdom';
import { nextLink } from '../../src/search-results-page/next-link';

describe('next-link', () => {
  it('encodes the cursor for http', () => {
    const nextLinkAnchor = nextLink({
      pageNumber: 1,
      category: 'articles',
      query: 'bats',
      nextCursor: O.some('foo+/bar'),
    });

    const rendered = JSDOM.fragment(nextLinkAnchor);
    const linkHref = rendered.querySelector('a')?.getAttribute('href');

    const someString = '/search?query=bats&category=articles&cursor=foo%2B%2Fbar&page=1';

    expect(linkHref).toStrictEqual(someString);
  });
});
