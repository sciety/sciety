import { renderPage } from '../../src/about-page/render-page';

describe('render-about-page middleware', () => {
  it('returns a page with the given HTML embedded', async () => {
    const html = '<h1>About stuff</h1>';
    const rendered = renderPage(html);

    expect(rendered).toStrictEqual(expect.objectContaining({
      content: expect.stringContaining(html),
    }));
  });
});
