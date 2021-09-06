import * as S from './session';
import { arbitraryDate, arbitraryString, arbitraryWord } from '../test/helpers';

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

    describe('when the pageViews all fall into a single chunk of time', () => {
      it('returns a single session', () => {
        const session = {
          visitorId: arbitraryWord(),
          pageViews: [
            {
              time_local: new Date('2021-09-06 11:00'),
              request: arbitraryString(),
            },
            {
              time_local: new Date('2021-09-06 11:05'),
              request: arbitraryString(),
            },
          ],
        };

        expect(S.split(session)).toStrictEqual([session]);
      });
    });
  });
});
