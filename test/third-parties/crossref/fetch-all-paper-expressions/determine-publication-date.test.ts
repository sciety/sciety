import { CrossrefWork } from '../../../../src/third-parties/crossref/fetch-all-paper-expressions/crossref-work';
import { determinePublicationDate } from '../../../../src/third-parties/crossref/fetch-all-paper-expressions/determine-publication-date';
import { arbitraryUri } from '../../../helpers';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';

describe('determine-publication-date', () => {
  describe('when the date specifies a year, a month and a day', () => {
    it('returns that date', () => {
      const expectedDate = new Date('2020-12-19');
      const work: CrossrefWork = {
        type: 'posted-content' as const,
        DOI: arbitraryExpressionDoi(),
        resource: {
          primary: {
            URL: arbitraryUri(),
          },
        },
        posted: {
          'date-parts': [[expectedDate.getFullYear(), expectedDate.getMonth() + 1, expectedDate.getDate()]],
        },
        relation: { },
      };
      const date = determinePublicationDate(work);

      expect(date).toStrictEqual(expectedDate);
    });
  });

  describe('when the date specifies only a year and a month', () => {
    it('returns a date matching the first day of the given month', () => {
      const expectedDate = new Date('2020-12-01');
      const work: CrossrefWork = {
        type: 'posted-content' as const,
        DOI: arbitraryExpressionDoi(),
        resource: {
          primary: {
            URL: arbitraryUri(),
          },
        },
        posted: {
          'date-parts': [[expectedDate.getFullYear(), expectedDate.getMonth() + 1]],
        },
        relation: { },
      };
      const date = determinePublicationDate(work);

      expect(date).toStrictEqual(expectedDate);
    });
  });

  describe('when the date specifies only a year', () => {
    const expectedDate = new Date('2020-01-01');
    const work: CrossrefWork = {
      type: 'posted-content' as const,
      DOI: arbitraryExpressionDoi(),
      resource: {
        primary: {
          URL: arbitraryUri(),
        },
      },
      posted: {
        'date-parts': [[expectedDate.getFullYear()]],
      },
      relation: { },
    };
    const date = determinePublicationDate(work);

    it('returns a date matching the first day of the given year', () => {
      expect(date).toStrictEqual(expectedDate);
    });
  });
});
