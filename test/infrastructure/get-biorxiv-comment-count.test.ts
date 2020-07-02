import { Maybe } from 'true-myth';
import createGetBiorxivCommentCount, { GetCommentCountForUri } from '../../src/infrastructure/get-biorxiv-comment-count';
import Doi from '../../src/types/doi';

const doi = new Doi('10.1101/833392');

describe('get-biorxiv-comment-count adapter', (): void => {
  it('returns the number of comments', async (): Promise<void> => {
    const getCommentCountForUri: GetCommentCountForUri = async () => Maybe.just(37);
    const actual = await createGetBiorxivCommentCount(getCommentCountForUri)(doi);

    expect(actual.unsafelyUnwrap()).toBe(37);
  });

  describe('when the number of comments can\'t be returned', () => {
    it.todo('throws an exception defined by the port');
  });
});
