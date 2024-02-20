import {
  CrossrefDate,
} from '../../../../src/third-parties/crossref/fetch-all-paper-expressions/crossref-work';
import { determinePublicationDate } from '../../../../src/third-parties/crossref/fetch-all-paper-expressions/determine-publication-date';

describe('determine-publication-date', () => {
  describe('when the date specifies a year, a month and a day', () => {
    const expectedDate = new Date('2020-12-19');
    const crossrefDate: CrossrefDate = {
      'date-parts': [[
        expectedDate.getFullYear(),
        expectedDate.getMonth() + 1,
        expectedDate.getDate(),
      ]],
    };
    const date = determinePublicationDate(crossrefDate);

    it('returns that date', () => {
      expect(date).toStrictEqual(expectedDate);
    });
  });

  describe('when the date specifies only a year and a month', () => {
    const expectedDate = new Date('2020-12-01');
    const crossrefDate: CrossrefDate = {
      'date-parts': [[
        expectedDate.getFullYear(),
        expectedDate.getMonth() + 1,
      ]],
    };
    const date = determinePublicationDate(crossrefDate);

    it('returns a date matching the first day of the given month', () => {
      expect(date).toStrictEqual(expectedDate);
    });
  });

  describe('when the date specifies only a year', () => {
    const expectedDate = new Date('2020-01-01');
    const crossrefDate: CrossrefDate = {
      'date-parts': [[
        expectedDate.getFullYear(),
      ]],
    };
    const date = determinePublicationDate(crossrefDate);

    it('returns a date matching the first day of the given year', () => {
      expect(date).toStrictEqual(expectedDate);
    });
  });
});
