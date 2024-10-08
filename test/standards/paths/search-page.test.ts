import { constructSearchPageHref } from '../../../src/standards/paths';

describe('constructSearchPageHref', () => {
  it('encodes the cursor for http', () => {
    const nextLinkAnchor = constructSearchPageHref(
      'foo+/bar',
      'bats',
      true,
      2,
    );

    const expectedHref = '/search?query=bats&cursor=foo%2B%2Fbar&includeUnevaluatedPreprints=true&page=2';

    expect(nextLinkAnchor).toStrictEqual(expectedHref);
  });

  it('encodes the query for http', () => {
    const nextLinkAnchor = constructSearchPageHref(
      'foo',
      'bats+bugs',
      true,
      2,
    );

    const expectedHref = '/search?query=bats%2Bbugs&cursor=foo&includeUnevaluatedPreprints=true&page=2';

    expect(nextLinkAnchor).toStrictEqual(expectedHref);
  });

  describe('when the includeUnevaluatedPreprints filter is not set', () => {
    const nextLinkAnchor = constructSearchPageHref(
      'foo',
      'bats',
      false,
      2,
    );

    it('excludes the param from the href', () => {
      const expectedHref = '/search?query=bats&cursor=foo&page=2';

      expect(nextLinkAnchor).toStrictEqual(expectedHref);
    });
  });
});
