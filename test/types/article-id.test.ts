import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { arbitraryExpressionDoi } from './expression-doi.helper';
import { ArticleId, articleIdCodec } from '../../src/types/article-id';
import * as AID from '../../src/types/article-id';

describe('article-id', () => {
  it.each([
    '10.5281/zenodo.3678326',
    'doi:10.5281/zenodo.3678326', // TODO: is this ever needed?
  ])('accepts valid DOI syntax', (doiSyntaxExample) => {
    expect(pipe(
      new ArticleId(doiSyntaxExample),
      (articleId) => articleId.value,
    )).toBe('10.5281/zenodo.3678326');
  });

  describe('toString()', () => {
    const articleId = new ArticleId(arbitraryExpressionDoi());

    it('prefixes with "doi:"', () => {
      expect(AID.toString(articleId)).toBe(`doi:${articleId.value}`);
    });
  });

  it.each([
    'http://dx.doi.org/10.5281/zenodo.3678326',
    'https://dx.doi.org/10.5281/zenodo.3678326',
    'http://doi.org/10.5281/zenodo.3678326',
    'https://doi.org/10.5281/zenodo.3678326',
    '10..1000/journal.pone.0011111',
    '1.1/1.1',
    '10/134980',
    '10.001/001#00',
  ])('rejects invalid DOI syntax', (badDoiSyntaxExample) => {
    expect(() => new ArticleId(badDoiSyntaxExample)).toThrow(new Error(`'${badDoiSyntaxExample}' is not a possible DOI`));
  });

  it('encodes and decodes back to the same value', () => {
    const doi = new ArticleId(arbitraryExpressionDoi());

    expect(pipe(
      doi,
      articleIdCodec.encode,
      articleIdCodec.decode,
    )).toStrictEqual(E.right(doi));
  });
});
