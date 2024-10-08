import * as O from 'fp-ts/Option';
import { constructPartialHref } from '../../../src/standards/paths';

describe('constructPartialHref', () => {
  it('encodes the cursor for http', () => {
    const nextLinkAnchor = constructPartialHref(
      O.some('foo+/bar'),
      'bats',
      true,
    );

    const expectedHref = '/search?query=bats&cursor=foo%2B%2Fbar&includeUnevaluatedPreprints=true&';

    expect(nextLinkAnchor).toStrictEqual(O.some(expectedHref));
  });

  it('encodes the query for http', () => {
    const nextLinkAnchor = constructPartialHref(
      O.some('foo'),
      'bats+bugs',
      true,
    );

    const expectedHref = '/search?query=bats%2Bbugs&cursor=foo&includeUnevaluatedPreprints=true&';

    expect(nextLinkAnchor).toStrictEqual(O.some(expectedHref));
  });

  describe('when the evaluatedOnly filter is set', () => {
    const nextLinkAnchor = constructPartialHref(
      O.some('foo'),
      'bats',
      false,
    );

    it('includes the filter in the href', () => {
      const expectedHref = '/search?query=bats&cursor=foo&';

      expect(nextLinkAnchor).toStrictEqual(O.some(expectedHref));
    });
  });
});
