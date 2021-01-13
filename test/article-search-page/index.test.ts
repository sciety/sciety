import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import buildRenderPage from '../../src/article-search-page';
import createServer from '../http/server';

describe('create render page', (): void => {
  it('displays search results', async (): Promise<void> => {
    const { adapters } = await createServer();
    const renderPage = buildRenderPage(adapters);
    const params = { query: '10.1101/833392' };

    const content = await pipe(
      renderPage(params),
      TE.map((page) => page.content),
    )();

    expect(content).toStrictEqual(E.right(expect.stringContaining('Search results')));
  });
});
