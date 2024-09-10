import { renderAsJson } from '../../../../../src/read-side/non-html-views/api/status/render-as-json';
import { ArticleId } from '../../../../../src/types/article-id';
import { arbitraryExpressionDoi } from '../../../../types/expression-doi.helper';

describe('render-as-json', () => {
  describe('given an article id', () => {
    const result = renderAsJson(new ArticleId(arbitraryExpressionDoi()));

    it('renders a string', () => {
      expect(typeof result.state).toBe('string');
    });
  });

  describe('given an URL', () => {
    it.todo('renders a string');
  });
});
