import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { transformCoarNotificationUriToAnnouncementActionUri } from '../../../../src/ingest/evaluation-discovery/coar/transform-coar-notification-uri-to-announcement-action-uri';
import { arbitraryUri } from '../../../helpers';

describe('transform-coar-notification-uri-to-announcement-action-uri', () => {
  describe('when the coar notification uri returns a 4xx or 5xx status code', () => {
    const coarNotificationUri = arbitraryUri();
    let result: E.Either<string, string>;

    beforeEach(async () => {
      result = await pipe(
        coarNotificationUri,
        transformCoarNotificationUriToAnnouncementActionUri,
      )();
    });

    it('returns on the left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('when the coar notification uri returns an announcement', () => {
    it.todo('returns an announcement action uri');
  });

  describe('when the coar notification uri returns data that is not an announcement', () => {
    it.todo('returns on the left');
  });
});
