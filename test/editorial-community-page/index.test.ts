import { Maybe } from 'true-myth';
import buildRenderPage, { Params } from '../../src/editorial-community-page';
import createServer from '../http/server';

describe('create render page', (): void => {
  describe('when the editorial community exists', (): void => {
    let renderedPage: string;

    beforeEach(async () => {
      const { adapters } = await createServer();
      const renderPage = buildRenderPage(adapters);
      const allCommunities = await adapters.editorialCommunities.all();
      const params: Params = { id: allCommunities[0].id.value, user: Maybe.nothing() };
      renderedPage = (await renderPage(params)).unsafelyUnwrap();
    });

    it('has the editorial community name', async (): Promise<void> => {
      expect(renderedPage).toStrictEqual(expect.stringContaining('eLife'));
    });

    it('has the editorial community description', async (): Promise<void> => {
      expect(renderedPage).toStrictEqual(expect.stringContaining('Contents of'));
    });
  });

  describe('when the editorial community does not exist', (): void => {
    it('throws a NotFound error', async (): Promise<void> => {
      const { adapters } = await createServer();
      const renderPage = buildRenderPage(adapters);
      const params: Params = { id: 'no-such-community', user: Maybe.nothing() };
      const result = await renderPage(params);

      expect(result.unsafelyUnwrapErr().type).toStrictEqual('not-found');
    });
  });
});
