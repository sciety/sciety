describe('fetch-recommended-papers', () => {
  describe('when a good response is returned', () => {
    it.todo('translates to RelatedArticles');
  });

  describe('when a response containing unsuported articles is returned', () => {
    it.todo('removes the unsupported articles');
  });

  describe('when we cannot access Semantic Scholar', () => {
    it.todo('returns a left');
  });

  describe('when we cannot decode the response', () => {
    it.todo('returns a left');
  });
});
