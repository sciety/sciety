import * as E from 'fp-ts/Either';
import { fetchNcrcReview } from '../../src/infrastructure/fetch-ncrc-review';
import * as NcrcId from '../../src/types/ncrc-id';

describe('fetch-ncrc-review', () => {
  describe('when the review is found', () => {
    it('returns the review', async () => {
      const id = NcrcId.fromString('0c88338d-a401-40f9-8bf8-ef0a43be4548');

      const result = await fetchNcrcReview(id)();

      expect(E.isRight(result)).toBe(true);
    });
  });

  describe('when the review is not found', () => {
    it('returns the review', async () => {
      const id = NcrcId.fromString('11111111-1111-1111-1111-111111111111');

      const result = await fetchNcrcReview(id)();

      expect(result).toStrictEqual(E.left('not-found'));
    });
  });
});
