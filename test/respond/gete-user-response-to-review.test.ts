describe('get-user-response-to-review', () => {
  describe('no-response-state for this review and user', () => {
    describe('command: RespondHelpful', () => {
      it.todo('return UserFoundReviewHelpful event');
    });

    describe('command: RespondNotHelpful', () => {
      it.todo('return UserFoundReviewNotHelpful event');
    });

    describe('command: RevokeMyResponse', () => {
      it.todo('error');
    });
  });

  describe('helpful-state for this review and user', () => {
    describe('command: RespondHelpful', () => {
      it.todo('return no events');
    });

    describe('command: RespondNotHelpful', () => {
      it.todo('return UserRevokedFindingReviewHelpful and UserFoundReviewNotHelpful events');
    });

    describe('command: RevokeMyResponse', () => {
      it.todo('return UserRevokedFindingReviewHelpful event');
    });
  });

  describe('not-helpful-state for this review and user', () => {
    describe('command: RespondHelpful', () => {
      it.todo('return UserRevokedFindingReviewNotHelpful and UserFoundReviewHelpful events');
    });

    describe('command: RespondNotHelpful', () => {
      it.todo('return no events');
    });

    describe('command: RevokeMyResponse', () => {
      it.todo('return UserRevokedFindingReviewNotHelpful event');
    });
  });
});
