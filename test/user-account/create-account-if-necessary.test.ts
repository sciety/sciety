describe('create-account-if-necessary', () => {
  describe('when the user has already created an account', () => {
    describe('because there is a UserCreatedAccount event', () => {
      it.todo('raises no events');
    });

    describe('because there are already events initiated by this user, but no UserCreatedAccount event', () => {
      it.todo('raises no events');
    });
  });

  describe('when the user has not already created an account', () => {
    it.todo('raises a UserCreatedAccount event');
  });
});
