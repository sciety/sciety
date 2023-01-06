describe('updateSetOfUsersWithoutCreatedAccountEvents', () => {
  describe('when the userId has not been seen before', () => {
    describe('when the next event is UserCreatedAccount', () => {
      it.todo('the userId is marked as having an account');
    });

    describe('when the next event is not UserCreatedAccount', () => {
      it.todo('the userId is marked as not having an account');
    });
  });

  describe('when the userId has been seen before', () => {
    describe('when the next event is UserCreatedAccount', () => {
      it.todo('the userId is marked as having an account');
    });

    describe('when the next event is not UserCreatedAccount', () => {
      describe('and the user is already marked as having an account', () => {
        it.todo('the userId is still marked as having an account');
      });

      describe('and the user is already marked as not having an account', () => {
        it.todo('the userId is still marked as not having an account');
      });
    });
  });
});
