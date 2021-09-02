describe('generate-docmap-index', () => {
  it.todo('includes an absolute url for each docmap in the index');

  describe('when no group identifier is supplied', () => {
    it.todo('includes a url to the hardcoded Review Commons docmap');

    it.todo('includes urls to the NCRC docmaps');
  });

  describe('when passed a group identifier for NCRC', () => {
    it.todo('only returns urls for NCRC docmaps');
  });

  describe('when passed a group identifier for Review Commons', () => {
    it.todo('only returns urls for Review Commons docmaps');
  });

  describe('when passed anything else as the group argument', () => {
    it.todo('returns an empty index');
  });
});
