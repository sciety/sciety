import { JSDOM } from 'jsdom';
import request, { Response } from 'supertest';
import { Maybe, Result } from 'true-myth';
import createServer from './server';
import { Page, renderFullPage } from '../../src/http/page-handler';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { RenderPageError } from '../../src/types/render-page-error';

describe('page-handler', (): void => {
  describe('article page', () => {
    it('sets the og meta tags to the article details', async () => {
      const { server } = await createServer();
      const response: Response = await request(server).get('/articles/10.1101/646810');
      const html = response.text;
      const rendered = JSDOM.fragment(html);
      const ogTitle = rendered.querySelector('meta[property="og:title"]')?.getAttribute('content');
      const ogDescription = rendered.querySelector('meta[property="og:description"]')?.getAttribute('content');

      expect(ogTitle).toBe('Article title');
      expect(ogDescription).toBe('Article abstract.');
    });
  });

  describe('render-full-page', () => {
    it('renders the description of an error', async () => {
      const description = toHtmlFragment('Something bad happened');
      const page = Result.err<Page, RenderPageError>({
        type: 'not-found',
        description,
      });
      const rendered = renderFullPage(page, Maybe.nothing());

      expect(rendered).toStrictEqual(expect.stringContaining(description));
    });
  });
});
