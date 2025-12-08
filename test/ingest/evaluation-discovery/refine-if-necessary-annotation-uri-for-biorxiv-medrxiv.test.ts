import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Annotation } from '../../../src/ingest/evaluation-discovery/hypothesis/annotation';
import { refineIfNecessaryAnnotationUriForBiorxivMedrxiv } from '../../../src/ingest/evaluation-discovery/refine-if-necessary-annotation-uri-for-biorxiv-medrxiv';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryAnnotation } from '../helpers';

const dependencies = {
  fetchHead: () => TE.right({ link: '' }),
  fetchData: shouldNotBeCalled,
};

describe('refine-if-necessary-annotation-uri-for-biorxiv-medrxiv', () => {
  describe('given the annotation`s uri can be parsed as a url', () => {
    describe.each([
      ['biorxiv', 'https://biorxiv.org/content/10.1101/2021.11.04.467308', 'https://biorxiv.org/content/10.64898/2021.11.04.467308', 'http://biorxiv.org/cgi/content/short/483891', 'https://www.biorxiv.org/content/10.1101/483891'],
      ['medrxiv', 'https://medrxiv.org/content/10.1101/2021.11.04.467308', 'https://medrxiv.org/content/10.64898/2021.11.04.467308', 'http://medrxiv.org/cgi/content/short/483891', 'https://www.medrxiv.org/content/10.1101/483891'],
    ])('when the uri contains the %s hostname', (_, cshpUri, openrxivUri, shortUri, expectedRefinedUri) => {
      describe('and the uri contains the Cold Spring Harbor Press DOI prefix (10.1101)', () => {
        const annotation = {
          ...arbitraryAnnotation(),
          uri: cshpUri,
        };
        let result: Annotation;

        beforeEach(async () => {
          result = await pipe(
            annotation,
            refineIfNecessaryAnnotationUriForBiorxivMedrxiv(dependencies),
            TE.getOrElse(shouldNotBeCalled),
          )();
        });

        it('does not refine the uri of the annotation', () => {
          expect(result).toStrictEqual(annotation);
        });
      });

      describe('and the uri contains the openrxiv DOI prefix (10.64898)', () => {
        const annotation = {
          ...arbitraryAnnotation(),
          uri: openrxivUri,
        };
        let result: Annotation;

        beforeEach(async () => {
          result = await pipe(
            annotation,
            refineIfNecessaryAnnotationUriForBiorxivMedrxiv(dependencies),
            TE.getOrElse(shouldNotBeCalled),
          )();
        });

        it('does not refine the uri of the annotation', () => {
          expect(result).toStrictEqual(annotation);
        });
      });

      describe('and the uri contains neither the DOI prefixes for openrxiv nor Cold Spring Harbor Press', () => {
        const annotation = {
          ...arbitraryAnnotation(),
          uri: shortUri,
        };

        const annotationWithRefinedUri = {
          ...annotation,
          uri: expectedRefinedUri,
        };
        let result: Annotation;

        beforeEach(async () => {
          result = await pipe(
            annotation,
            refineIfNecessaryAnnotationUriForBiorxivMedrxiv({
              ...dependencies,
              fetchHead: () => TE.right({ link: expectedRefinedUri }),
            }),
            TE.getOrElse(shouldNotBeCalled),
          )();
        });

        it('refines the uri of the annotation', () => {
          expect(result).toStrictEqual(annotationWithRefinedUri);
        });
      });
    });

    describe('when the uri does not contain the biorxiv nor medrxiv hostname', () => {
      it.todo('does not refine the uri of the annotation');
    });
  });

  describe('given the annotation\'s uri cannot be parsed as a url', () => {
    it.todo('does not refine the uri of the annotation');
  });
});
