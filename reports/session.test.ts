import * as S from './session';
import { arbitraryString, arbitraryWord } from '../test/helpers';

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
            {
              time_local: new Date('2021-09-06 11:06'),
              request: arbitraryString(),
            },
          ],
        };

        expect(S.split(session)).toStrictEqual([session]);
      });
    });

    describe('when the pageViews fall into different chunks of time', () => {
      it('returns a split session', () => {
        const visitorId = arbitraryWord();
        const pv1 = {
          time_local: new Date('2021-09-06 11:00'),
          request: arbitraryString(),
        };
        const pv2 = {
          time_local: new Date('2021-09-06 12:00'),
          request: arbitraryString(),
        };
        const pv3 = {
          time_local: new Date('2021-09-06 12:05'),
          request: arbitraryString(),
        };
        const session = {
          visitorId,
          pageViews: [pv1, pv2, pv3],
        };

        expect(S.split(session)).toStrictEqual([
          {
            visitorId,
            pageViews: [pv1],
          },
          {
            visitorId,
            pageViews: [pv2, pv3],
          },
        ]);
      });
    });
  });
});
