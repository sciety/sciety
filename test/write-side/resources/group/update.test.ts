describe('update', () => {
  describe('when the group has joined', () => {
    describe('and they have never updated their details', () => {
      describe('when passed a new name for the group', () => {
        it.todo('raises an event to update the group name');
      });

      describe('when passed the group\'s existing name', () => {
        it.todo('raises no events');
      });
    });

    describe('and they have previously updated their details', () => {
      describe('when passed a new name for the group', () => {
        it.todo('raises an event to update the group name');
      });

      describe('when passed the group\'s existing name', () => {
        it.todo('raises no events');
      });
    });
  });

  describe('when the group has not joined', () => {
    describe('when passed any command', () => {
      it.todo('fails');
    });
  });
});
