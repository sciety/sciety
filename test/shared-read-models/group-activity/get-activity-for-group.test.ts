describe('get-activity-for-group', () => {
  describe('when the group does not exist', () => {
    it.todo('returns None');
  });

  describe('when the group exists', () => {
    describe('when there are no recorded evaluations', () => {
      it.todo('returns an evaluationCount of 0');

      it.todo('return a None for the latestActivityAt');
    });

    describe('when there are N recorded evaluations', () => {
      it.todo('returns an evaluationCount of N');

      it.todo('returns the latest publishedAt date of the evaluations as the latestActivityAt');
    });

    describe('when there is 1 recorded evaluation', () => {
      it.todo('returns an evaluationCount of 1');

      it.todo('returns the publishedAt date of the evaluation as the latestActivityAt');
    });

    describe('when there are 2 evaluations', () => {
      describe('and the most recently recorded is the most recently published evaluation', () => {
        it.todo('returns an evaluationCount of 2');

        it.todo('returns the most recent publishedAt date as the latestActivityAt');
      });

      describe('and the most recently recorded is not the most recently published evaluation', () => {
        it.todo('returns an evaluationCount of 2');

        it.todo('returns the most recent publishedAt date as the latestActivityAt');
      });
    });
  });
});
