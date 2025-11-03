import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { transformCoarNotificationUriToAnnouncementActionUri } from '../../../../src/ingest/evaluation-discovery/coar/transform-coar-notification-uri-to-announcement-action-uri';
import { arbitraryUri } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';

describe('transform-coar-notification-uri-to-announcement-action-uri', () => {
  describe('when the coar notification uri request fails', () => {
    const coarNotificationUri = arbitraryUri();
    let result: E.Either<string, string>;

    beforeEach(async () => {
      result = await pipe(
        coarNotificationUri,
        transformCoarNotificationUriToAnnouncementActionUri({ fetchData: () => TE.left('fetch data fails for any reason') }),
      )();
    });

    it('returns on the left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('when the coar notification uri returns an announcement', () => {
    const announcementActionUri = arbitraryUri();
    const stubbedSuccessfulResponse = {
      object: {
        id: announcementActionUri,
        object: null,
        type: [
          'Document',
          'sorg:Review',
        ],
        'ietf:cite-as': null,
        url: null,
      },
    };
    let result: string;

    beforeEach(async () => {
      result = await pipe(
        arbitraryUri(),
        transformCoarNotificationUriToAnnouncementActionUri(
          { fetchData: <D>() => TE.right(stubbedSuccessfulResponse as D) },
        ),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns an announcement action uri', () => {
      expect(result).toStrictEqual(announcementActionUri);
    });
  });

  describe('when the coar notification uri returns data that is not an announcement', () => {
    const coarNotificationUri = arbitraryUri();
    const stubbedIncorrectData = {
      object: {
        object: null,
        type: [
          'Document',
          'sorg:Review',
        ],
        'ietf:cite-as': null,
        url: null,
      },
    };
    let result: E.Either<string, string>;

    beforeEach(async () => {
      result = await pipe(
        coarNotificationUri,
        transformCoarNotificationUriToAnnouncementActionUri(
          { fetchData: <D>() => TE.right(stubbedIncorrectData as D) },
        ),
      )();
    });

    it('returns on the left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});
