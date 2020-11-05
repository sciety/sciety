import buildRenderPage, { FetchStaticFile } from '../../src/about-page/index';

const fetchStaticFile: FetchStaticFile = async (filename) => (`# Contents of ${filename}`);

describe('create render page', (): void => {
  it('inserts the HTML text into the response body', async (): Promise<void> => {
    const renderPage = buildRenderPage({ fetchStaticFile });
    const rendered = await renderPage();

    expect(rendered.isOk()).toBe(true);
    expect(rendered.unsafelyUnwrap().content).toStrictEqual(expect.stringContaining('<h1>Contents of about.md</h1>'));
  });
});
