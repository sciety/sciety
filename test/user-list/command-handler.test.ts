describe('command-handler', () => {
  describe('article is in the list', () => {
    describe('and a RemoveArticleFromUserList Command is issued', () => {
      it.todo('creates an ArticleRemovedFromUserList Event');
    });

    describe('and a SaveArticleToUserList Command is issued', () => {
      it.todo('creates no events');
    });
  });

  describe('article is not in the list', () => {
    describe('and a RemoveArticleFromUserList Command is issued', () => {
      it.todo('creates no events');
    });

    describe('and a SaveArticleToUserList Command is issued', () => {
      it.todo('creates a UserSavedArticle Event');
    });
  });
});
