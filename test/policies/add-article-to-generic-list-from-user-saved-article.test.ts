describe('add-article-to-generic-list-from-user-saved-article', () => {
  describe('when a UserSavedArticle event is received', () => {
    describe('and the user has a generic list', () => {
      it.todo('calls the AddArticleToList command');

      it.todo('calls the command with the generic list id owned by that user');

      it.todo('calls the command with the article id in the UserSavedArticle event');
    });

    describe('and the user does not have a generic list', () => {
      it.todo('logs an error');
    });
  });

  describe('when any other event is received', () => {
    it.todo('does not call the AddArticleToList command');
  });
});
