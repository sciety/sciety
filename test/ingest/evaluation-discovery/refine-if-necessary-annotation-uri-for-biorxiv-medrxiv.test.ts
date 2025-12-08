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
    describe('when the uri contains the biorxiv hostname', () => {
      describe('and the uri contains the Cold Spring Harbor Press DOI prefix (10.1101)', () => {
        const annotation = {
          ...arbitraryAnnotation(),
          uri: 'https://biorxiv.org/content/10.1101/2021.11.04.467308',
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
          uri: 'https://biorxiv.org/content/10.64898/2021.11.04.467308',
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
        it.todo('refines the uri of the annotation');
      });
    });

    describe('when the uri contains the medrxiv hostname', () => {
      describe('and the uri contains the Cold Spring Harbor Press DOI prefix', () => {
        it.todo('does not refine the uri of the annotation');
      });

      describe('and the uri contains the openrxiv DOI prefix', () => {
        it.todo('does not refine the uri of the annotation');
      });

      describe('and the uri contains neither the DOI prefixes for openrxiv nor Cold Spring Harbor Press', () => {
        it.todo('refines the uri of the annotation');
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
