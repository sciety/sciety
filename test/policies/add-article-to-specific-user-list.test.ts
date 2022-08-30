describe('add-article-to-specific-user-list', () => {
  describe('when a UserSavedArticle event is received', () => {
    describe('when the user is David Ashbrook', () => {
      it.todo('calls the AddArticleToList command');
    });

    describe('when the user is not David Ashbrook', () => {
      it.todo('does not call the AddArticleToList command');
    });
  });

  describe('when any other event is received', () => {
    it.todo('does not call the AddArticleToList command');
  });
});
