import { parseSembleCards } from '../../src/third-parties/fetch-semble-card-urls';

describe('fetch-semble-card-urls', () => {
  describe('parseSembleCards', () => {
    it('returns the doi, lowercased, and the url of each line', () => {
      const fileContents = [
        '{"url":"https://www.biorxiv.org/content/10.1101/2024.01.16.575490v1","doi":"10.1101/2024.01.16.575490"}',
        '{"url":"https://osf.io/preprints/psyarxiv/687au_v1","doi":"10.31234/OSF.IO/687AU"}',
        '',
      ].join('\n');

      expect(parseSembleCards(fileContents)).toStrictEqual([
        { doi: '10.1101/2024.01.16.575490', url: 'https://www.biorxiv.org/content/10.1101/2024.01.16.575490v1' },
        { doi: '10.31234/osf.io/687au', url: 'https://osf.io/preprints/psyarxiv/687au_v1' },
      ]);
    });

    it.each([
      ['not json'],
      ['{"url":"https://example.com"}'],
      ['{"doi":"10.1101/2024.01.16.575490"}'],
      ['{"url":"","doi":"10.1101/2024.01.16.575490"}'],
      ['{"url":"https://example.com","doi":"not-a-doi"}'],
    ])('ignores a line that is not json or does not have a valid doi and url: %s', (line) => {
      expect(parseSembleCards(line)).toStrictEqual([]);
    });

    it('returns nothing for an empty file', () => {
      expect(parseSembleCards('')).toStrictEqual([]);
    });
  });
});
