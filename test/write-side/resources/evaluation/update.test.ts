describe('update', () => {
  describe('when the evalution publication has been recorded', () => {
    describe('when passed a new value for a single attribute', () => {
      describe.each([
        ['type'],
        ['authors'],
      ])('%s', (attributeToBeChanged) => {
        describe('and this evaluation has never been updated', () => {
          it.todo(`raises an event to update the evaluation ${attributeToBeChanged}`);
        });

        describe(`and this evaluations's ${attributeToBeChanged} has previously been updated`, () => {
          it.todo(`raises an event to update the evaluation ${attributeToBeChanged}`);
        });
      });
    });

    describe('when passed a new value for one attribute and an unchanged value for a different attribute', () => {
      describe.each([
        ['type', 'authors'],
        ['authors', 'type'],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ])('new %s, existing %s', (attributeToBeChanged, unchangedAttribute) => {
        describe('and this evaluation\'s details have never been updated', () => {
          it.todo(`raises an event to only update the evaluation ${attributeToBeChanged}`);
        });

        describe(`and this evaluations's ${attributeToBeChanged} has previously been updated`, () => {
          it.todo(`raises an event to only update the evaluation's ${attributeToBeChanged}`);
        });
      });
    });

    describe('when passed an unchanged value for a single attribute', () => {
      describe.each([
        ['type'],
        ['authors'],
      ])('%s', (attributeToBeChanged) => {
        describe('and this evaluation\'s details have never been updated', () => {
          it.todo('raises no events');
        });

        describe(`and this evaluation's ${attributeToBeChanged} has previously been updated`, () => {
          it.todo('raises no events');
        });
      });
    });
  });

  describe('when the evaluation publication has not been recorded', () => {
    describe('when passed any command', () => {
      it.todo('returns an error');
    });
  });

  describe('when an EvaluationUpdated event exists without a previous EvaluationPublicationRecorded event', () => {
    it.todo('returns an error');
  });

  describe('when an EvaluationUpdated event is followed by a EvaluationPublicationRecorded event', () => {
    it.todo('returns an error');
  });
});
