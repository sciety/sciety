import * as S from './session';
import { arbitraryWord } from '../test/helpers';

describe('session', () => {
  describe('split', () => {
    describe('when the input session has no pageViews', () => {
      it('returns it unchanged', () => {
        const session = {
          visitorId: arbitraryWord(),
          pageViews: [],
        };

        expect(S.split(session)).toStrictEqual([session]);
      });
    });
  });
});
