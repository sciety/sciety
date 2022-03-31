import { buildPageUrl } from '../../src/search-results-page/build-page-url';
import { arbitraryBoolean, arbitraryString } from '../helpers';

const arbitraryCategory = (): 'articles' | 'groups' => (arbitraryBoolean() ? 'articles' : 'groups');

describe('build-page-url', () => {
  const defaultParams = {
    category: arbitraryCategory(),
    query: arbitraryString(),
    evaluatedOnly: arbitraryBoolean(),
  };

  it('builds the URL with the correct category', () => {
    const result = buildPageUrl({
      ...defaultParams,
      category: 'articles',
    });

    expect(result).toContain('category=articles');
  });

  it('builds the URL with the correct query', () => {
    const query = 'a search term';
    const result = buildPageUrl({
      ...defaultParams,
      query,
    });

    expect(result).toContain(`query=${query}`);
  });

  describe('when evaluatedOnly is true', () => {
    it('builds the URL with the evaluatedOnly filter set', () => {
      const result = buildPageUrl({
        ...defaultParams,
        evaluatedOnly: true,
      });

      expect(result).toContain('evaluatedOnly=true');
    });
  });

  describe('when evaluatedOnly is false', () => {
    it('builds the URL without the evaluatedOnly filter set', () => {
      const result = buildPageUrl({
        ...defaultParams,
        evaluatedOnly: false,
      });

      expect(result).not.toContain('evaluatedOnly');
    });
  });
});
