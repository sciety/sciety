import { NotFound } from 'http-errors';
import { JSDOM } from 'jsdom';
import { buildRenderPage } from '../../src/editorial-community-page';
import createServer from '../http/server';

describe('create render page', (): void => {
  let renderedPage: string;

  describe('when the editorial community exists', (): void => {
    beforeEach(async () => {
      const { adapters } = await createServer();
      const renderPage = buildRenderPage(adapters);
      const params = { id: adapters.editorialCommunities.all()[0].id };
      renderedPage = await renderPage(params);
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
      await expect(renderPage(params)).rejects.toStrictEqual(new NotFound('no-such-community not found'));
    });
  });
});
