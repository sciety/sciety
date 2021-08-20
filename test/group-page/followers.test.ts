/* eslint-disable jest/no-commented-out-tests */

describe('followers', () => {
  describe('when the group has multiple followers', () => {
    it.todo('limits the number of user cards to the requested page size');

    it.todo('returns the specified page of the followers');

    // it.each([
    //  [9, 1, O.none],
    //  [11, 1, O.some(2)],
    //  [20, 1, O.some(2)],
    //  [20, 2, O.none],
    //  [21, 2, O.some(3)],
    //  [21, 3, O.none],
    // ]).todo('given %d followers and a request for page %d, returns the next page');

    it.todo('returns not-found when asked for a page that does not exist');

    it.todo('returns an empty page 1 when there are no followers');
  });
});
