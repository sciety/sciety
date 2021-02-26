import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { editorialCommunityPage } from '../../src/editorial-community-page';
import { createTestServer } from '../http/server';

describe('create render page', () => {
  describe('when the editorial community does not exist', () => {
    it('throws a NotFound error', async () => {
      const { adapters } = await createTestServer();
      const renderPage = editorialCommunityPage(adapters);
      const result = await renderPage({ id: 'no-such-community', user: O.none })();

      expect(result).toStrictEqual(E.left(expect.objectContaining({ type: 'not-found' })));
    });
  });
});
