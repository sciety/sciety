describe('fetch-zenodo-record', () => {
  describe('when the DOI is from Zenodo', () => {
    describe('when the request succeeds', () => {
      it.todo('returns the metadata description as full text');

      it.todo('returns the Doi.org url as url');
    });

    describe('when the request fails', () => {
      it.todo('returns a left');
    });
  });

  describe('when the DOI is not from Zenodo', () => {
    it.todo('returns a left');
  });
});
