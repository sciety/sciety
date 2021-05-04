describe('populate-article-view-models', () => {
  describe('no failures', () => {
    it.todo('returns a single article view model by adding article metadata and a version date');
  });

  describe('version date failing', () => {
    // double check this with product
    it.todo('returns an article view model without a version date');
  });

  describe('only one of two articles failing, on article title and authors', () => {
    it.todo('only returns view models for the not failing articles');

    it.todo('does not return an article view model for the failing article');
  });

  describe('all articles failing', () => {
    it.todo('decide later');
  });
});
