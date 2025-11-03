import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  transformAnnouncementActionUriToSignpostingDocmapUri,
} from '../../../../src/ingest/evaluation-discovery/coar/transform-announcement-action-uri-to-signposting-docmap-uri';
import { arbitraryUri } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';

describe('transform-announcement-action-uri-to-signposting-docmap-uri', () => {
  describe('when the announcement action uri request fails', () => {
    const announcementActionUri = arbitraryUri();
    let result: E.Either<string, string>;

    beforeEach(async () => {
      result = await pipe(
        announcementActionUri,
        transformAnnouncementActionUriToSignpostingDocmapUri({ fetchData: () => TE.left('fetch data fails for any reason') }),
      )();
    });

    it('returns on the left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('given the announcement action uri request succeeds', () => {
    describe('when it returns a link header with a Signposting DocMap URI', () => {
      const announcementActionUri = 'https://neuro.peercommunityin.org/articles/rec?id=217#review-549';
      let result: string;

      beforeEach(async () => {
        result = await pipe(
          announcementActionUri,
          transformAnnouncementActionUriToSignpostingDocmapUri({ fetchData: () => TE.left('fetch data fails for any reason') }),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('returns that Signposting DocMap URI', () => {
        expect(result).toBe('https://neuro.peercommunityin.org/metadata/docmaps?article_id=217');
      });
    });

    describe('when it does not return a link header', () => {
      it.todo('returns on the left');
    });

    describe('when it returns a link header without a Signposting DocMap URI', () => {
      it.todo('returns on the left');
    });
  });
});
