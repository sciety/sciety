describe('in memory eventstore', () => {
  describe('a new eventstore', () => {
    it.todo('contains no events');
  });

  describe('given an eventstore containing some events', () => {
    describe('when an event is committed', () => {
      it.todo('is dispatched to the listeners');

      it.todo('is the last event listed by getAllEvents');
    });
  });
});
