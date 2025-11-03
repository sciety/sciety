import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  transformAnnouncementActionUriToSignpostingDocmapUri,
} from '../../../../src/ingest/evaluation-discovery/coar/transform-announcement-action-uri-to-signposting-docmap-uri';
import { arbitraryUri } from '../../../helpers';

describe('transform-announcement-action-uri-to-signposting-docmap-uri', () => {
  describe('when the announcement action uri HEAD request returns a link header with a Signposting DocMap URI', () => {
    it.todo('returns a Signposting DocMap URI');
  });

  describe('when the announcement action uri HEAD request fails', () => {
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

  describe('when the announcement action uri HEAD request does not return a link header', () => {
    it.todo('returns on the left');
  });

  describe('when the announcement action uri HEAD request returns a link header without a Signposting DocMap URI', () => {
    it.todo('returns on the left');
  });
});
