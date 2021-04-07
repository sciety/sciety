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
  latestActivityDate: O.none,
  reviewCount: 0,
};

describe('render-search-result component', () => {
  it('displays title and authors', async () => {
    const rendered = renderSearchResult(searchResult);

    expect(rendered).toStrictEqual(expect.stringContaining(searchResult.doi.value));
    expect(rendered).toStrictEqual(expect.stringContaining(searchResult.title));
    expect(rendered).toStrictEqual(expect.stringContaining(searchResult.authors));
  });

  describe('when there are evaluations', () => {
    it('displays the number of evaluations', async () => {
      const rendered = renderSearchResult({
        _tag: 'Article',
        doi: new Doi('10.1101/833392'),
        title: 'the title',
        authors: '1, 2, 3',
        postedDate: new Date('2017-11-30'),
        latestVersionDate: O.none,
        latestActivityDate: O.none,
        reviewCount: 37,
      });

      expect(rendered).toStrictEqual(expect.stringMatching('37 evaluations'));
    });

    it('displays the latest activity date', () => {
      const rendered = renderSearchResult({ ...searchResult, latestActivityDate: O.some(new Date('2020-01-02')) });

      expect(rendered).toStrictEqual(expect.stringMatching(/Latest activity[\s\S]*?Jan 2, 2020/));
    });

    it('displays the correct pluralisation for 1 evaluations', async () => {
      const rendered = renderSearchResult({
        _tag: 'Article',
        doi: new Doi('10.1101/833392'),
        title: 'the title',
        authors: '1, 2, 3',
        postedDate: new Date('2017-11-30'),
        latestVersionDate: O.none,
        latestActivityDate: O.none,
        reviewCount: 1,
      });

      expect(rendered).toStrictEqual(expect.stringMatching('1 evaluation'));
    });
  });

  describe('when there are no evaluations', () => {
    it('does not display an activity date', () => {
      const rendered = renderSearchResult({ ...searchResult, latestActivityDate: O.none });

      expect(rendered).not.toContain('Latest activity');
    });
  });

  describe('when there is a latest version date', () => {
    it('displays the posted date', async () => {
      const rendered = renderSearchResult({ ...searchResult, latestVersionDate: O.some(new Date('2020-06-07')) });

      expect(rendered).toStrictEqual(expect.stringMatching(/Latest version[\s\S]*?Jun 7, 2020/));
    });
  });

  describe('when there is not a latest version date', () => {
    it('displays the posted date', async () => {
      const rendered = renderSearchResult({ ...searchResult, latestVersionDate: O.none });

      expect(rendered).toStrictEqual(expect.stringMatching(/Posted[\s\S]*?Nov 30, 2017/));
    });
  });
});
