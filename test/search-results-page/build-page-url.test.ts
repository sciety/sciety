import { buildPageUrl } from '../../src/search-results-page/build-page-url';
import { arbitraryBoolean, arbitraryString } from '../helpers';

const arbitraryCategory = () => (arbitraryBoolean() ? 'articles' : 'groups');

describe('build-page-url', () => {
  it('builds the URL with the correct category', () => {
    const result = buildPageUrl({
      category: 'articles',
      query: arbitraryString(),
      evaluatedOnly: arbitraryBoolean(),
    });

    expect(result).toContain('category=articles');
  });

  it('builds the URL with the correct query', () => {
    const query = 'a search term';
    const result = buildPageUrl({
      query,
      category: arbitraryCategory(),
      evaluatedOnly: arbitraryBoolean(),
    });

    expect(result).toContain(`query=${query}`);
  });

  describe('when evaluatedOnly is true', () => {
    it('builds the URL with the evaluatedOnly filter set', () => {
      const result = buildPageUrl({
        evaluatedOnly: true,
        query: arbitraryString(),
        category: arbitraryCategory(),
      });

      expect(result).toContain('evaluatedOnly=true');
    });
  });

  describe('when evaluatedOnly is false', () => {
    it('builds the URL without the evaluatedOnly filter set', () => {
      const result = buildPageUrl({
        evaluatedOnly: false,
        query: arbitraryString(),
        category: arbitraryCategory(),
      });

      expect(result).not.toContain('evaluatedOnly');
    });
  });
});
