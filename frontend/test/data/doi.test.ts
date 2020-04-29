import Doi from '../../src/data/doi';

describe('doi', () => {
  it.each([
    '10.5281/zenodo.3678326',
    'doi:10.5281/zenodo.3678326',
    'http://dx.doi.org/10.5281/zenodo.3678326',
    'https://dx.doi.org/10.5281/zenodo.3678326',
    'http://doi.org/10.5281/zenodo.3678326',
    'https://doi.org/10.5281/zenodo.3678326',
  ])('accepts valid DOI syntax', (doiSyntaxExample) => {
    expect(new Doi(doiSyntaxExample).toString()).toEqual('10.5281/zenodo.3678326');
  });

  it.each([
    '10..1000/journal.pone.0011111',
    '1.1/1.1',
    '10/134980',
    '10.001/001#00',
    undefined,
  ])('rejects invalid DOI syntax', (badDoiSyntaxExample) => {
    expect(() => new Doi(badDoiSyntaxExample)).toThrow();
  });
});
