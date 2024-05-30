describe('getGroupCardForAGroup', () => {
  describe('when the selected group exists', () => {
    it.todo('returns an O.some of the group card for the selected group');

    describe('when a group has updated its name', () => {
      it.todo('the card contains the current name of the group');
    });

    describe('when a group has updated its short description', () => {
      it.todo('the card contains the current short description of the group');
    });

    describe('when a group has updated its avatarPath', () => {
      it.todo('the card contains the current avatarPath of the group');
    });

    describe('when a group has updated its largeLogoPath', () => {
      it.todo('the card contains the current largeLogoPath of the group');
    });
  });

  describe('when the selected group does not exist', () => {
    it.todo('returns O.none');
  });
});
