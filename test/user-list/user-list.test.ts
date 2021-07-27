describe('user-list', () => {
  describe('when receiving a RemoveArticleFromUserList Command', () => {
    describe('given a user list that has never contained the article', () => {
      it.todo('does not create new events');
    });

    describe('given a user list where the article has already been saved', () => {
      it.todo('creates a ArticleRemovedFromUserList Event');
    });

    describe('given a user list where the article has already been removed', () => {
      it.todo('does not create new events');
    });
  });
});
