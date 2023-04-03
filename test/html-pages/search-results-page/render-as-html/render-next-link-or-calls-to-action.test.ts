import * as O from 'fp-ts/Option';
import { JSDOM } from 'jsdom';
import { renderNextLinkOrCallsToAction } from '../../../../src/html-pages/search-results-page/render-as-html/render-next-link-or-calls-to-action';

describe('render-next-link-or-calls-to-action', () => {
  it('encodes the cursor for http', () => {
    const nextLinkAnchor = renderNextLinkOrCallsToAction({
      pageNumber: 2,
      category: 'articles',
      query: 'bats',
      evaluatedOnly: false,
      nextCursor: O.some('foo+/bar'),
    });

    const rendered = JSDOM.fragment(nextLinkAnchor);
    const linkHref = rendered.querySelector('a')?.getAttribute('href');

    const expectedHref = '/search?query=bats&category=articles&cursor=foo%2B%2Fbar&page=2';

    expect(linkHref).toStrictEqual(expectedHref);
  });

  it('encodes the query for http', () => {
    const nextLinkAnchor = renderNextLinkOrCallsToAction({
      pageNumber: 2,
      category: 'articles',
      query: 'bats+bugs',
      evaluatedOnly: false,
      nextCursor: O.some('foo'),
    });

    const rendered = JSDOM.fragment(nextLinkAnchor);
    const linkHref = rendered.querySelector('a')?.getAttribute('href');

    const expectedHref = '/search?query=bats%2Bbugs&category=articles&cursor=foo&page=2';

    expect(linkHref).toStrictEqual(expectedHref);
  });

  describe('when the evaluatedOnly filter is set', () => {
    const nextLinkAnchor = renderNextLinkOrCallsToAction({
      pageNumber: 2,
      category: 'articles',
      query: 'bats',
      evaluatedOnly: true,
      nextCursor: O.some('foo'),
    });

    const rendered = JSDOM.fragment(nextLinkAnchor);
    const linkHref = rendered.querySelector('a')?.getAttribute('href');

    it('includes the filter in the href', () => {
      const expectedHref = '/search?query=bats&category=articles&cursor=foo&evaluatedOnly=true&page=2';

      expect(linkHref).toStrictEqual(expectedHref);
    });
  });
});
