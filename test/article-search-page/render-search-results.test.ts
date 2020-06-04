import { renderSearchResults } from '../../src/article-search-page';

describe('render-search-results component', (): void => {
  it('queries by a DOI', async (): Promise<void> => {
    const rendered = await renderSearchResults('10.1101/833392');

    expect(rendered).toStrictEqual(expect.stringContaining('10.1101/833392'));
  });
});
