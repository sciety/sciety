import * as O from 'fp-ts/Option';
import { renderAsJson } from '../../../../../src/read-side/non-html-views/api/status/render-as-json';
import { ArticleId } from '../../../../../src/types/article-id';
import { arbitraryUrl } from '../../../../helpers';
import { arbitraryExpressionDoi } from '../../../../types/expression-doi.helper';

describe('render-as-json', () => {
  describe('given an article id', () => {
    const result = renderAsJson(new ArticleId(arbitraryExpressionDoi()));

    it('renders a string', () => {
      expect(typeof result.state).toBe('string');
    });
  });

  describe('given an URL', () => {
    const result = renderAsJson(arbitraryUrl());

    it('renders a string', () => {
      expect(typeof result.state).toBe('string');
    });
  });

  describe('given an object', () => {
    const result = renderAsJson({ example: 42 });

    it('renders a string', () => {
      expect(typeof result.state).toBe('string');
    });
  });

  describe('given an Option of a string which is a Some', () => {
    const result = renderAsJson(O.some('foo'));

    it('renders the string\'s value', () => {
      expect(result.state).toBe('"foo"');
    });
  });

  describe('given an Option of a Record which is a Some', () => {
    const result = renderAsJson(O.some({ example: 42 }));

    it('renders the Option\'s value', () => {
      expect(result.state).toBe('{"example":42}');
    });
  });

  describe('given an Option which is a None', () => {
    const result = renderAsJson(O.none);

    it('renders null', () => {
      expect(result.state).toBe('null');
    });
  });
});
