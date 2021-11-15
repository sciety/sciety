describe('evaluated-articles-list', () => {
  describe('when article details for the page can be fetched', () => {
    it.todo('returns article cards for each article');

    it.todo('shows "page x of y"');
  });

  describe('when there are no evaluated articles', () => {
    it.todo('displays a static message');

    it.todo('doesn\'t show "page x of y"');
  });

  describe('when there is more than one page', () => {
    it.todo('links to the next page');

    it.todo('shows "page x of y"');
  });

  describe('when some of the article details can\'t be retrieved', () => {
    it.todo('returns cards for all of the articles');

    it.todo('shows "page x of y"');
  });

  describe('when none of the article details can be retrieved', () => {
    it.todo('returns "this information can\'t be found" message');

    it.todo('doesn\'t show "page x of y"');
  });

  describe('when the requested page is out of bounds', () => {
    it.todo('returns not found');
  });
});
