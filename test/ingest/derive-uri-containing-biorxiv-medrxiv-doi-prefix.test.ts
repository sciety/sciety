import {
  deriveUriContainingBiorxivMedrxivDoiPrefix,
} from '../../src/ingest/derive-uri-containing-biorxiv-medrxiv-doi-prefix';

describe('derive-uri-containing-biorxiv-medrxiv-doi-prefix', () => {
  it.todo('returns a URI');

  it.skip('returns a URI containing a biorxiv or medrxiv DOI prefix', () => {
    expect(deriveUriContainingBiorxivMedrxivDoiPrefix('foo')).toContain('/10.64898/');
  });
});
