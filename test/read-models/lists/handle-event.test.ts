describe('handle-event', () => {
  describe('given an ArticleRemovedFromList event', () => {
    describe.each([
      ['when the list does not exist'],
      ['when the article is not in the list'],
    ])('%s', () => {
      it.todo('does not change the read model state');
    });
  });
});
