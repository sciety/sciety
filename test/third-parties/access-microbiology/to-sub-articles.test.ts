import * as E from 'fp-ts/Either';
import { toSubArticles } from '../../../src/third-parties/access-microbiology/to-sub-articles';

describe('to-sub-articles', () => {
  describe('when the input is not a string', () => {
    const result = toSubArticles(undefined);

    it('fails', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});
