describe('respond-helpful-command', () => {
  describe('no-response-state for this review and user', () => {
    it.todo('return UserFoundReviewHelpful event');
  });

  describe('helpful-state for this review and user', () => {
    it.todo('return no events');
  });

  describe('not-helpful-state for this review and user', () => {
    it.todo('return UserRevokedFindingReviewNotHelpful and UserFoundReviewHelpful events');
  });
});
