import { publisherAccountId } from '../../../src/read-side/non-html-views/docmaps/docmap/publisher-account-id';
import { arbitraryGroup } from '../../types/group.helper';

describe('publisher-account-id', () => {
  const group = arbitraryGroup();
  const id = publisherAccountId(group);

  it('points to an existing page on Sciety', () => {
    expect(id).toMatch(/^https:\/\/sciety.org\//);
  });

  it('contains a readable identifier for the group', () => {
    expect(id).toContain(group.slug);
  });
});
