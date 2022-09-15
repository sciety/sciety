describe('create-user-saved-articles-list-as-generic-list', () => {
  describe('when a UserSavedArticle event is received', () => {
    describe('and that user owns no generic list', () => {
      describe('if the command succeeds', () => {
        it.todo('calls the CreateList command');

        it.todo('calls the command with the user as the owner');

        it.todo('calls the command with "@{handle}\'s saved articles" as a name');

        it.todo('calls the command with "Articles that have been saved by @{handle}" as a description');
      });

      describe('if the command fails', () => {
        it.todo('logs an error');
      });
    });

    describe('and the user already owns a generic list', () => {
      it.todo('does not call the CreateList command');
    });
  });

  describe('when any other event is received', () => {
    it.todo('does not call the CreateList command');
  });
});
