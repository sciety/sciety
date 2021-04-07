import * as O from 'fp-ts/Option';
import {
  ItemViewModel,
  renderSearchResult,
} from '../../src/search-results-page/render-search-result';
import { Doi } from '../../src/types/doi';

const searchResult: ItemViewModel = {
  _tag: 'Article',
  doi: new Doi('10.1101/833392'),
  title: 'the title',
  authors: '1, 2, 3',
  postedDate: new Date('2017-11-30'),
  latestVersionDate: O.none,
  reviewCount: 0,
};

describe('render-search-result component', () => {
  it('displays title and authors', async () => {
    const rendered = renderSearchResult(searchResult);

    expect(rendered).toStrictEqual(expect.stringContaining(searchResult.doi.value));
    expect(rendered).toStrictEqual(expect.stringContaining(searchResult.title));
    expect(rendered).toStrictEqual(expect.stringContaining(searchResult.authors));
  });

  it('displays the posted date', async () => {
    const rendered = renderSearchResult(searchResult);

    expect(rendered).toStrictEqual(expect.stringMatching(/Posted[\s\S]*?Nov 30, 2017/));
  });

  it('displays the number of evaluations', async () => {
    const rendered = renderSearchResult({
      _tag: 'Article',
      doi: new Doi('10.1101/833392'),
      title: 'the title',
      authors: '1, 2, 3',
      postedDate: new Date('2017-11-30'),
      latestVersionDate: O.none,
      reviewCount: 37,
    });

    expect(rendered).toStrictEqual(expect.stringMatching('37 evaluations'));
  });

  it('displays the correct pluralisation for 1 evaluations', async () => {
    const rendered = renderSearchResult({
      _tag: 'Article',
      doi: new Doi('10.1101/833392'),
      title: 'the title',
      authors: '1, 2, 3',
      postedDate: new Date('2017-11-30'),
      latestVersionDate: O.none,
      reviewCount: 1,
    });

    expect(rendered).toStrictEqual(expect.stringMatching('1 evaluation'));
  });
});
