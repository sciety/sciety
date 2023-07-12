describe('update', () => {
  describe('when the evaluation locator has been recorded', () => {
    describe('when the evaluation type has not been recorded', () => {
      it.todo('returns an EvaluationUpdated event');
    });

    describe('when the evaluation type has been recorded', () => {
      describe('and it is the same value as the one being passed in', () => {
        it.todo('returns no events');
      });

      describe('and it is not the same value as the one being passed in', () => {
        it.todo('returns an EvaluationUpdated event');
      });
    });
  });

  describe('when the evaluation locator has not been recorded', () => {
    it.todo('fails');
  });
});
