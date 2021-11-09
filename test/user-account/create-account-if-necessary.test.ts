describe('create-account-if-necessary', () => {
  describe('when the user has already created an account', () => {
    describe('because there is an account creation event', () => {
      it.todo('raises no events');
    });

    describe('because there are breadcrumb events and there is no account creation event', () => {
      it.todo('raises no events');
    });
  });

  describe('when the user has not already created an account', () => {
    it.todo('raises an account creation event');
  });
});
