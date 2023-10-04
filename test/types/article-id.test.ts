import { pipe } from 'fp-ts/function';
import { ArticleId } from '../../src/types/article-id';
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

  it('has a prefix', () => {
    const articleId = new ArticleId('10.5281/zenodo.3678326');

    expect(AID.hasPrefix('10.5281')(articleId)).toBe(true);
    expect(AID.hasPrefix('10.5282')(articleId)).toBe(false);
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
});
