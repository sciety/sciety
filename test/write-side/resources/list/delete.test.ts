describe('delete', () => {
  describe('when the list identified in the command exists', () => {
    it.todo('raises exactly one event');

    it.todo('returns a ListDeleted event');
  });

  describe('no list with the given id ever existed', () => {
    it.todo('fails with not-found');
  });

  describe('when the list identified in the command existed but has been deleted', () => {
    it.todo('fails with not-found');
  });
});
