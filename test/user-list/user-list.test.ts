describe('user-list', () => {
  describe('when receiving a RemoveArticleFromUserList Command', () => {
    describe('given a user list where the article has already been saved', () => {
      describe('multiple articles saved to list', () => {
        it.todo('creates a ArticleRemovedFromUserList Event');
      });
    });

    describe('given a user list where the article has already been removed', () => {
      it.todo('does not create new events');
    });
  });
});
