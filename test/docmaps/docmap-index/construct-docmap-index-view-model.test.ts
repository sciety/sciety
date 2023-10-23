describe('construct-docmap-index-view-model', () => {
  describe('docmap-index', () => {
    describe('when all ports work', () => {
      describe('and there are no docmaps', () => {
        it.todo('return an empty list in the articles field');

        it.todo('return a 200 status code');
      });

      describe('when there are docmaps', () => {
        it.todo('return them as a list in the articles field');

        it.todo('return a 200 status code');
      });
    });

    describe('when any docmap fails to generate', () => {
      it.todo('returns a body containing an error object');

      it.todo('returns a 500 status code');
    });

    describe('when the query parameters are invalid', () => {
      it.todo('returns a body containing an error object');

      it.todo('returns a 400 status code');
    });
  });

  describe('filter-by-params', () => {
    describe('when no params are given', () => {
      it.todo('returns unmodified input');
    });

    describe('when invalid params are given', () => {
      it.todo('returns a "bad request"');
    });

    describe('when passed a publisher account ID', () => {
      it.todo('only returns entries by the corresponding group');
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

  describe('identify-all-possible-index-entries', () => {
    describe('when a supported group has evaluated multiple articles', () => {
      it.todo('returns a list of all the evaluated index entry models');
    });

    describe('when a supported group has evaluated an article multiple times', () => {
      it.todo('returns the latest updated date');
    });

    describe('when there is an evaluated event by an unsupported group', () => {
      it.todo('excludes articles evaluated by the unsupported group');
    });

    describe('when a supported group cannot be fetched', () => {
      it.todo('fails with an internal server error');
    });
  });
});
