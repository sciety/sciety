describe('construct-lists-that-can-be-featured', () => {
  describe('given a group', () => {
    describe('given a user list that is populated', () => {
      describe('and is currently featured by this group', () => {
        it.todo('is not included');
      });

      describe('and is not currently featured by this group', () => {
        it.todo('is included');
      });

      describe('and was featured by this group, but is not longer featured', () => {
        it.todo('is included');
      });

      describe('and is currently featured only by a different group', () => {
        it.todo('is included');
      });
    });

    describe('given a user list that is empty', () => {
      it.todo('is not included');
    });

    describe('given a list owned by the group', () => {
      it.todo('is not included');
    });

    describe('given a list owned by a different group', () => {
      it.todo('is not included');
    });
  });
});
