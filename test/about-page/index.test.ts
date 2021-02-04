import * as T from 'fp-ts/Task';
import { aboutPage, FetchStaticFile } from '../../src/about-page/index';

const fetchStaticFile: FetchStaticFile = (filename) => T.of(`# Contents of ${filename}`);

describe('create render page', () => {
  it('inserts the HTML text into the response body', async () => {
    const renderPage = aboutPage({ fetchStaticFile });
    const rendered = await renderPage()();

    expect(rendered.content).toStrictEqual(expect.stringContaining('<h1>Contents of about.md</h1>'));
  });
});
