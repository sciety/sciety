describe('construct-docmap-index-view-model', () => {
  describe('when there are no docmaps', () => {
    it.todo('returns an empty list');
  });

  describe('when there are some docmaps', () => {
    describe('when the whole index is requested', () => {
      it.todo('returns unmodified input');
    });

    describe('when a particular publisher account ID is requested', () => {
      it.todo('only returns docmaps by the corresponding group');
    });

    describe('when only docmaps updated after a certain date are requested', () => {
      it.todo('only returns docmaps whose updated property is after the specified date');
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

  describe('when one of the docmaps requires a third-party query to construct', () => {
    describe('when the third-party query succeeds', () => {
      it.todo('returns the docmap as part of the index');
    });

    describe('when the third-party query fails', () => {
      it.todo('fails to produce an index');
    });
  });
});
