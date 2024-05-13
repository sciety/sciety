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
    describe('when ingestDays does not exceed the earliestAllowedStartDate', () => {
      it.todo('returns a date in the past');
    });

    describe('when ingestDays goes to far into the past', () => {
      it.todo('returns the earliestAllowedStartDate');
    });
  });
});
