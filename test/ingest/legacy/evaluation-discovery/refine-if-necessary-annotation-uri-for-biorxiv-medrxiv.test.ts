import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from '../../../../src/ingest/legacy/discover-published-evaluations';
import { Annotation } from '../../../../src/ingest/legacy/evaluation-discovery/hypothesis/annotation';
import { refineIfNecessaryAnnotationUriForBiorxivMedrxiv } from '../../../../src/ingest/legacy/evaluation-discovery/refine-if-necessary-annotation-uri-for-biorxiv-medrxiv';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryAnnotation } from '../../helpers';

const executeRefineIfNecessaryAnnotationUriForBiorxivMedrxiv = (
  annotation: Annotation,
  dependencies: Dependencies,
) => pipe(
  annotation,
  refineIfNecessaryAnnotationUriForBiorxivMedrxiv(dependencies),
  TE.getOrElse(shouldNotBeCalled),
);

describe('refine-if-necessary-annotation-uri-for-biorxiv-medrxiv', () => {
  const dependencies = {
    fetchHead: shouldNotBeCalled,
    fetchData: shouldNotBeCalled,
  };

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
          result = await executeRefineIfNecessaryAnnotationUriForBiorxivMedrxiv(annotation, dependencies)();
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
          result = await executeRefineIfNecessaryAnnotationUriForBiorxivMedrxiv(annotation, dependencies)();
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
          result = await executeRefineIfNecessaryAnnotationUriForBiorxivMedrxiv(
            annotation,
            {
              ...dependencies,
              fetchHead: () => TE.right({ link: expectedRefinedUri }),
            },
          )();
        });

        it('refines the uri of the annotation', () => {
          expect(result).toStrictEqual(annotationWithRefinedUri);
        });
      });
    });

    describe('when the uri does not contain the biorxiv nor medrxiv hostname', () => {
      const annotation = arbitraryAnnotation();
      let result: Annotation;

      beforeEach(async () => {
        result = await executeRefineIfNecessaryAnnotationUriForBiorxivMedrxiv(annotation, dependencies)();
      });

      it('does not refine the uri of the annotation', () => {
        expect(result).toStrictEqual(annotation);
      });
    });
  });

  describe('given the annotation\'s uri cannot be parsed as a url', () => {
    const annotation = {
      ...arbitraryAnnotation(),
      uri: '1234',
    };
    let result: Annotation;

    beforeEach(async () => {
      result = await executeRefineIfNecessaryAnnotationUriForBiorxivMedrxiv(annotation, dependencies)();
    });

    it('does not refine the uri of the annotation', () => {
      expect(result).toStrictEqual(annotation);
    });
  });
});
