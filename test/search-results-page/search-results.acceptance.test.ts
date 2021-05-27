describe('search-results-page acceptance', () => {
  describe('given a query', () => {
    it.todo('displays the query inside the search form');

    it.todo('displays the number of matching articles');

    it.todo('displays the number of matching groups');

    describe('with no category provided', () => {
      it.todo('defaults to "articles" category');
    });

    describe('when there are results', () => {
      it.todo('displays a maximum of ten results');

      describe('with "articles" as category', () => {
        it.todo('only displays article results');

        it.todo('displays "Articles" as the active tab');

        it.todo('displays "Groups" as a link tab');

        describe('when extra details of an article cannot be fetched', () => {
          it.todo('display the article without extra details');
        });

        describe('when the search for all articles fails', () => {
          it.todo('display an error message');
        });
      });

      describe('with "groups" as category', () => {
        it.todo('only displays groups results');

        it.todo('displays "Groups" as the active tab');

        it.todo('displays "Articles" as a link tab');

        describe('when details of a group cannot be fetched', () => {
          it.todo('only displays the successfully fetched groups');
        });

        describe('when details of all groups cannot be fetched', () => {
          it.todo('display no result cards');
        });
      });
    });

    describe('when there are no results', () => {
      it.todo('displays no result cards');
    });
  });
});
