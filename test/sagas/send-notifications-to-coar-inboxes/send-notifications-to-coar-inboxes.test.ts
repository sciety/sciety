describe('send-notifications-to-coar-inboxes', () => {
  describe('when there are no pending notification', () => {
    it.todo('does nothing');
  });

  describe('when there is one pending notification', () => {
    describe('and the target accepts the notification', () => {
      it.todo('records the notification as delivered');
    });

    describe('and the target rejects the notification', () => {
      it.todo('leaves the notification as pending');
    });
  });
});
