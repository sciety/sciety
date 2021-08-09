describe('fetch-prelights-evaluations', () => {
  describe('when the feed contains a highlight ...', () => {
    describe('referring to a single preprint', () => {
      it.todo('records the highlight as an evaluation');

      it.todo('records no skipped items');
    });

    describe('referring to two preprints', () => {
      it.todo('records the highlight as two evaluations');

      it.todo('records no skipped items');
    });

    describe('referring to an article that is not on biorxiv', () => {
      it.todo('records no evaluations');

      it.todo('records the item as skipped');
    });
  });

  describe('when the feed is empty', () => {
    it.todo('records no evaluations');

    it.todo('records no skipped items');
  });
});
