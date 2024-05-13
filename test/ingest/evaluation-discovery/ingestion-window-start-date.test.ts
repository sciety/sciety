describe('ingestion-window-start-date', () => {
  describe('when only ingestDays are specified', () => {
    it.todo('returns a date in the past');
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
