import * as crossrefDate from '../../../../src/third-parties/crossref/fetch-all-paper-expressions/date-stamp';

describe('toDate', () => {
  describe('when the date specifies a year, a month and a day', () => {
    const expectedDate = new Date('2020-12-19');
    const input: crossrefDate.DateStamp = {
      'date-parts': [[
        expectedDate.getFullYear(),
        expectedDate.getMonth() + 1,
        expectedDate.getDate(),
      ]],
    };
    const date = crossrefDate.toDate(input);

    it('returns that date', () => {
      expect(date).toStrictEqual(expectedDate);
    });
  });

  describe('when the date specifies only a year and a month', () => {
    const expectedDate = new Date('2020-12-01');
    const input: crossrefDate.DateStamp = {
      'date-parts': [[
        expectedDate.getFullYear(),
        expectedDate.getMonth() + 1,
      ]],
    };
    const date = crossrefDate.toDate(input);

    it('returns a date matching the first day of the given month', () => {
      expect(date).toStrictEqual(expectedDate);
    });
  });

  describe('when the date specifies only a year', () => {
    const expectedDate = new Date('2020-01-01');
    const input: crossrefDate.DateStamp = {
      'date-parts': [[
        expectedDate.getFullYear(),
      ]],
    };
    const date = crossrefDate.toDate(input);

    it('returns a date matching the first day of the given year', () => {
      expect(date).toStrictEqual(expectedDate);
    });
  });
});
