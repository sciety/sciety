import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { transformCoarNotificationUriToAnnouncementActionUri } from '../../../../src/ingest/evaluation-discovery/coar/transform-coar-notification-uri-to-announcement-action-uri';
import { arbitraryUri } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';

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
    const announcementActionUri = arbitraryUri();
    let result: string;

    beforeEach(async () => {
      result = await pipe(
        arbitraryUri(),
        transformCoarNotificationUriToAnnouncementActionUri,
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it.skip('returns an announcement action uri', () => {
      expect(result).toStrictEqual(announcementActionUri);
    });
  });

  describe('when the coar notification uri returns data that is not an announcement', () => {
    it.todo('returns on the left');
  });
});
