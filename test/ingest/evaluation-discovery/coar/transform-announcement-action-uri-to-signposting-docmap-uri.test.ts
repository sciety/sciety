import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  transformAnnouncementActionUriToSignpostingDocmapUri,
} from '../../../../src/ingest/evaluation-discovery/coar/transform-announcement-action-uri-to-signposting-docmap-uri';
import { arbitraryString, arbitraryUri } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';

describe('transform-announcement-action-uri-to-signposting-docmap-uri', () => {
  const announcementActionUri = arbitraryUri();

  describe('when the announcement action uri request fails', () => {
    let result: E.Either<string, string>;

    beforeEach(async () => {
      result = await pipe(
        announcementActionUri,
        transformAnnouncementActionUriToSignpostingDocmapUri({
          fetchData: () => TE.right(shouldNotBeCalled()),
          fetchHead: () => TE.left('fetch head fails for any reason'),
        }),
      )();
    });

    it('returns on the left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('given the announcement action uri request succeeds', () => {
    describe('when it returns a link header with a Signposting DocMap URI', () => {
      it.todo('returns that Signposting DocMap URI');
    });

    describe('when it does not return a link header', () => {
      const head = {
        'header 1': arbitraryString(),
      };
      let result: E.Either<string, string>;

      beforeEach(async () => {
        result = await pipe(
          announcementActionUri,
          transformAnnouncementActionUriToSignpostingDocmapUri({
            fetchData: () => TE.right(shouldNotBeCalled()),
            fetchHead: () => TE.right(head),
          }),
        )();
      });

      it.failing('returns on the left', () => {
        expect(E.isLeft(result)).toBe(true);
      });
    });

    describe('when it returns a link header without a Signposting DocMap URI', () => {
      it.todo('returns on the left');
    });
  });
});
