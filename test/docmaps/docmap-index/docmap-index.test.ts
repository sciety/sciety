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
