describe('filter-by-params', () => {
  describe('when no params are given', () => {
    it.todo('does not filter by group or date');
  });

  describe('when passed a group ID', () => {
    it.todo('only returns entries by that group');
  });

  describe('when passed an "updated after" parameter', () => {
    describe('when there are evaluations after the specified date', () => {
      it.todo('only returns entries whose latest evaluation is after the specified date');
    });

    describe('when there are no evaluations after the specified date', () => {
      it.todo('returns an empty array');
    });
  });
});
