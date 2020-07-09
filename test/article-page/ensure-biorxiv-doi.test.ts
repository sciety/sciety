import ensureBiorxivDoi from '../../src/article-page/ensure-biorxiv-doi';

describe('ensure-biorxiv-doi', (): void => {
  it('returns a DOI when the input is valid', async (): Promise<void> => {
    const input = '10.1101/111111';

    expect(ensureBiorxivDoi(input).unsafelyUnwrap().value).toStrictEqual(input);
  });

  it('returns nothing when the input is not a DOI', async (): Promise<void> => {
    expect(ensureBiorxivDoi('1234').isNothing()).toBe(true);
  });

  it('returns nothing when the DOI is not from bioRxiv', async (): Promise<void> => {
    expect(ensureBiorxivDoi('10.1234/222222').isNothing()).toBe(true);
  });
});
