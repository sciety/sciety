import * as O from 'fp-ts/Option';
import { constructSearchPageHref } from '../../../src/standards/paths';

describe('constructSearchPageHref', () => {
  it('encodes the cursor for http', () => {
    const nextLinkAnchor = constructSearchPageHref(
      O.some('foo+/bar'),
      'bats',
      true,
      2,
    );

    const expectedHref = '/search?query=bats&cursor=foo%2B%2Fbar&includeUnevaluatedPreprints=true&page=2';

    expect(nextLinkAnchor).toStrictEqual(O.some(expectedHref));
  });

  it('encodes the query for http', () => {
    const nextLinkAnchor = constructSearchPageHref(
      O.some('foo'),
      'bats+bugs',
      true,
      2,
    );

    const expectedHref = '/search?query=bats%2Bbugs&cursor=foo&includeUnevaluatedPreprints=true&page=2';

    expect(nextLinkAnchor).toStrictEqual(O.some(expectedHref));
  });

  describe('when the includeUnevaluatedPreprints filter is not set', () => {
    const nextLinkAnchor = constructSearchPageHref(
      O.some('foo'),
      'bats',
      false,
      2,
    );

    it('excludes the param from the href', () => {
      const expectedHref = '/search?query=bats&cursor=foo&page=2';

      expect(nextLinkAnchor).toStrictEqual(O.some(expectedHref));
    });
  });
});
