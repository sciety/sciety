describe('to-expression-published-feed-item', () => {
  describe('given a paper expression from a known server', () => {
    it.todo('publishedTo contains the server name');

    describe('when the server is a ColdSpringHabor server', () => {
      it.todo('publishedTo contains the path for the expression\'s url on that server');
    });

    describe('when the server is not a ColdSpringHabor server', () => {
      it.todo('publishedTo contains the DOI of the expression');
    });
  });

  describe('given a paper expression from an unknown server', () => {
    it.todo('publishedTo contains the DOI of the expression');
  });
});
