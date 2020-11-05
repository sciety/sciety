import createRenderPage, { RenderPage } from '../../src/about-page/render-page';

describe('render-about-page middleware', (): void => {
  it('returns a page with the given HTML embedded', async (): Promise<void> => {
    const html = '<h1>About stuff</h1>';
    const renderPage: RenderPage = createRenderPage(async () => html);
    const rendered = await renderPage('anyfile.md');

    expect(rendered.isOk()).toBe(true);
    expect(rendered.unsafelyUnwrap().content).toStrictEqual(expect.stringContaining(html));
  });
});
