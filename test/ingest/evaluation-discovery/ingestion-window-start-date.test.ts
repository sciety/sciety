import { ingestionWindowStartDate } from '../../../src/ingest/evaluation-discovery/ingestion-window-start-date';

describe('ingestion-window-start-date', () => {
  beforeEach(() => {
    jest.useFakeTimers({
      now: new Date('2020-01-06'),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('when only ingestDays are specified', () => {
    it('returns a date in the past', () => {
      expect(ingestionWindowStartDate(5)).toStrictEqual(new Date('2020-01-01'));
    });
  });

  describe('when both ingestDays and earliestAllowedStartDate are specified', () => {
    const earliestAllowedStartDate = new Date('2019-01-01');

    describe('when ingestDays does not exceed the earliestAllowedStartDate', () => {
      it('returns a date in the past', () => {
        expect(ingestionWindowStartDate(5, earliestAllowedStartDate)).toStrictEqual(new Date('2020-01-01'));
      });
    });

    describe('when ingestDays goes to far into the past', () => {
      it('returns the earliestAllowedStartDate', () => {
        expect(ingestionWindowStartDate(5000, earliestAllowedStartDate)).toStrictEqual(new Date('2019-01-01'));
      });
    });
  });
});
