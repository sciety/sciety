import { pipe } from 'fp-ts/function';
import { Doi } from '../../src/types/doi';
import * as RI from '../../src/types/review-id';

describe('doi', () => {
  it.each([
    '10.5281/zenodo.3678326',
    'doi:10.5281/zenodo.3678326', // TODO: is this ever needed?
  ])('accepts valid DOI syntax', (doiSyntaxExample) => {
    expect(pipe(
      new Doi(doiSyntaxExample),
      RI.key,
    )).toStrictEqual('10.5281/zenodo.3678326');
  });

  it('has a prefix', () => {
    const doi = new Doi('10.5281/zenodo.3678326');

    expect(doi.hasPrefix('10.5281')).toBe(true);
    expect(doi.hasPrefix('10.5282')).toBe(false);
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
    expect(() => new Doi(badDoiSyntaxExample)).toThrow(new Error(`'${badDoiSyntaxExample}' is not a possible DOI`));
  });
});
