import validateBiorxivDoi from '../../src/article-page/validate-biorxiv-doi';

describe('validate-biorxiv-doi', (): void => {
  it('returns a Doi object when the input is valid', async (): Promise<void> => {
    const input = '10.1101/111111';

    expect(validateBiorxivDoi(input).value).toStrictEqual(input);
  });

  it('throws an exception when the input is not a DOI', async (): Promise<void> => {
    expect(() => validateBiorxivDoi('1234')).toThrow(/1234/);
  });

  it('throws an exception when the DOI is not from bioRxiv', async (): Promise<void> => {
    expect(() => validateBiorxivDoi('10.1234/222222')).toThrow('Not a bioRxiv DOI');
  });
});
