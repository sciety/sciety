describe('determine-pages-to-select', () => {
  describe('when the total number of items is 0', () => {
    it.todo('selects no pages');
  });

  describe('when the total number of items is less than the page size', () => {
    it.todo('selects one page of offset 0');
  });

  describe('when the total number of items is greater than the page size, but less than twice the page size', () => {
    it.todo('selects two pages of offset 0 and 1000');
  });
});
