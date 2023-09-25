describe('construct-view-model', () => {
  describe('given an article in a list', () => {
    describe('when the logged in user is the list owner', () => {
      describe('when it never has been annotated', () => {
        it.todo('displays a call to action to create an annotation');
      });

      describe('when it is currently annotated', () => {
        it.todo('does not display a call to action to create an annotation');
      });
    });

    describe('when the user is not logged in', () => {
      it.todo('does not display a call to action to create an annotation');
    });

    describe('when the logged in user is not the list owner', () => {
      it.todo('does not display a call to action to create an annotation');
    });
  });
});
