import { CrossrefWork } from '../../../../src/third-parties/crossref/fetch-all-paper-expressions/crossref-work';
import { determinePublicationDate } from '../../../../src/third-parties/crossref/fetch-all-paper-expressions/determine-publication-date';
import { arbitraryUri } from '../../../helpers';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';

describe('determine-publication-date', () => {
  describe('when the date specifies a day', () => {
    it('returns a date matching the given day', () => {
      const expectedDate = new Date(2020, 11, 19);
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

  describe('when the date does not specify a day', () => {
    it('returns a date matching the first of the given month', () => {
      const expectedDate = new Date(2020, 11, 1);
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
});
