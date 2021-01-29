import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import buildRenderPage, { Params } from '../../src/editorial-community-page';
import { createTestServer } from '../http/server';

describe('create render page', (): void => {
  describe('when the editorial community does not exist', (): void => {
    it('throws a NotFound error', async (): Promise<void> => {
      const { adapters } = await createTestServer();
      const renderPage = buildRenderPage(adapters);
      const params: Params = { id: 'no-such-community', user: O.none };
      const result = await renderPage(params)();

      expect(result).toStrictEqual(E.left(expect.objectContaining({ type: 'not-found' })));
    });
  });
});
