import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  transformAnnouncementActionUriToSignpostingDocmapUri,
} from '../../../../src/ingest/evaluation-discovery/coar/transform-announcement-action-uri-to-signposting-docmap-uri';
import { arbitraryString, arbitraryUri } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';

const runExternalQuery = (head: { link: string }) => (uri: string) => pipe(
  uri,
  transformAnnouncementActionUriToSignpostingDocmapUri(
    {
      fetchData: () => TE.right(shouldNotBeCalled()),
      fetchHead: () => TE.right(head),
    },
  ),
);

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
    let result: E.Either<string, string>;

    describe('when it returns a link header with a Signposting DocMap URI', () => {
      let resultUri: string;
      const signpostingDocmapUri = 'https://neuro.peercommunityin.org/metadata/docmaps?article_id=217';
      const head = {
        link: `<${signpostingDocmapUri}>; rel="describedby" type="application/ld+json" profile="https://w3id.org/docmaps/context.jsonld", <https://neuro.peercommunityin.org/metadata/crossref?article_id=217>; rel="describedby" type="application/xml" profile="http://www.crossref.org/schema/4.3.7"`,
      };

      beforeEach(async () => {
        resultUri = await pipe(
          announcementActionUri,
          runExternalQuery(head),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('returns that Signposting DocMap URI', () => {
        expect(resultUri).toStrictEqual(signpostingDocmapUri);
      });
    });

    describe('when it returns a link header with multiple Signposting DocMap URIs', () => {
      let resultUri: string;
      const firstSignpostingDocmapUri = 'https://neuro.peercommunityin.org/metadata/docmaps?article_id=217';
      const secondSignpostingDocmapUri = 'https://neuro.peercommunityin.org/metadata/docmaps?article_id=321';
      const head = {
        link: `<${firstSignpostingDocmapUri}>; rel="describedby" type="application/ld+json" profile="https://w3id.org/docmaps/context.jsonld", <${secondSignpostingDocmapUri}>; rel="describedby" type="application/ld+json" profile="https://w3id.org/docmaps/context.jsonld"`,
      };

      beforeEach(async () => {
        resultUri = await pipe(
          announcementActionUri,
          runExternalQuery(head),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('returns the first Signposting DocMap URI', () => {
        expect(resultUri).toStrictEqual(firstSignpostingDocmapUri);
      });
    });

    describe('when it does not return a link header', () => {
      const head = {
        'header 1': arbitraryString(),
      };

      beforeEach(async () => {
        result = await pipe(
          announcementActionUri,
          transformAnnouncementActionUriToSignpostingDocmapUri({
            fetchData: () => TE.right(shouldNotBeCalled()),
            fetchHead: () => TE.right(head),
          }),
        )();
      });

      it('returns on the left', () => {
        expect(E.isLeft(result)).toBe(true);
      });
    });

    describe('when it returns a link header without a Signposting DocMap URI', () => {
      const head = {
        link: '<https://neuro.peercommunityin.org/metadata/crossref?article_id=217>; rel="describedby" type="application/xml" profile="http://www.crossref.org/schema/4.3.7"',
      };
      let errorMessage: string;

      beforeEach(async () => {
        result = await pipe(
          announcementActionUri,
          runExternalQuery(head),
        )();

        errorMessage = pipe(
          result,
          E.getOrElse((e) => e),
        );
      });

      it('returns on the left', () => {
        expect(E.isLeft(result)).toBe(true);
        expect(errorMessage).toBe('No DocMap URI found.');
      });
    });

    describe('when it returns a malformed link header', () => {
      const head = {
        link: arbitraryString(),
      };
      let errorMessage: string;

      beforeEach(async () => {
        result = await pipe(
          announcementActionUri,
          runExternalQuery(head),
        )();

        errorMessage = pipe(
          result,
          E.getOrElse((e) => e),
        );
      });

      it('returns on the left', () => {
        expect(E.isLeft(result)).toBe(true);
        expect(errorMessage).toBe('Failed to parse.');
      });
    });

    describe('when it returns a link header with an empty Signposting DocMap URI', () => {
      const head = {
        link: '<>; rel="describedby" type="application/ld+json" profile="https://w3id.org/docmaps/context.jsonld"',
      };
      let errorMessage: string;

      beforeEach(async () => {
        result = await pipe(
          announcementActionUri,
          runExternalQuery(head),
        )();

        errorMessage = pipe(
          result,
          E.getOrElse((e) => e),
        );
      });

      it('returns on the left', () => {
        expect(E.isLeft(result)).toBe(true);
        expect(errorMessage).toBe('No DocMap URI found.');
      });
    });
  });
});
