import { JSDOM } from 'jsdom';
import buildRenderPage from '../../src/editorial-community-page';
import createServer from '../http/server';

describe('create render page', (): void => {
  describe('when the editorial community exists', (): void => {
    let renderedPage: string;

    beforeEach(async () => {
      const { adapters } = await createServer();
      const renderPage = buildRenderPage(adapters);
      const params = { id: adapters.editorialCommunities.all()[0].id.value };
      renderedPage = (await renderPage(params)).unsafelyUnwrap();
    });

    it('has the editorial community name', async (): Promise<void> => {
      expect(renderedPage).toStrictEqual(expect.stringContaining('eLife'));
    });

    it('has the editorial community description', async (): Promise<void> => {
      expect(renderedPage).toStrictEqual(expect.stringContaining('accelerate'));
    });

    it('displays a count of reviews', async (): Promise<void> => {
      const rendered = JSDOM.fragment(renderedPage);

      expect(rendered.querySelector('[data-test-id="reviewsCount"]')?.textContent).toStrictEqual('1');
    });
  });

  describe('when the editorial community does not exist', (): void => {
    it('throws a NotFound error', async (): Promise<void> => {
      const { adapters } = await createServer();
      const renderPage = buildRenderPage(adapters);
      const params = { id: 'no-such-community' };
      const result = await renderPage(params);

      expect(result.unsafelyUnwrapErr().type).toStrictEqual('not-found');
    });
  });
});
