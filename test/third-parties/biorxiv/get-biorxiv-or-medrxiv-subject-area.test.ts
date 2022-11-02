import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { getBiorxivOrMedrxivSubjectArea } from '../../../src/third-parties/biorxiv/get-biorxiv-or-medrxiv-subject-area';
import * as DE from '../../../src/types/data-error';
import { SubjectArea } from '../../../src/types/subject-area';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryDate } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryDoi } from '../../types/doi.helper';

describe('get-biorxiv-or-medrxiv-subject-area', () => {
  describe('when the subject area is available on biorxiv', () => {
    const subjectArea = 'cell biology';
    const ports = {
      getJson: async (url: string) => (url.includes('/biorxiv')
        ? ({
          collection: [{
            category: subjectArea,
            version: '1',
            date: arbitraryDate().toISOString(),
          }],
        })
        : ({ collection: [] })),
      logger: dummyLogger,
    };
    let result: SubjectArea;

    beforeEach(async () => {
      result = await pipe(
        arbitraryDoi(),
        getBiorxivOrMedrxivSubjectArea(ports),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns the subject area', () => {
      expect(result.value).toStrictEqual(subjectArea);
    });
  });

  describe('when the subject area is available on medrxiv', () => {
    const subjectArea = 'addiction medicine';
    const ports = {
      getJson: async (url: string) => (url.includes('/medrxiv')
        ? ({
          collection: [{
            category: subjectArea,
            version: '1',
            date: arbitraryDate().toISOString(),
          }],
        })
        : ({ collection: [] })),
      logger: dummyLogger,
    };
    let result: SubjectArea;

    beforeEach(async () => {
      result = await pipe(
        arbitraryDoi(),
        getBiorxivOrMedrxivSubjectArea(ports),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns the subject area', () => {
      expect(result.value).toStrictEqual(subjectArea);
    });
  });

  describe('when the subject area is not available on either server', () => {
    const ports = {
      getJson: async () => ({ collection: [] }),
      logger: dummyLogger,
    };
    let result: E.Either<DE.DataError, SubjectArea>;

    beforeEach(async () => {
      result = await getBiorxivOrMedrxivSubjectArea(ports)(arbitraryDoi())();
    });

    it('returns a left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('when one article version is returned', () => {
    const ports = {
      getJson: async (url: string) => (url.includes('/medrxiv')
        ? ({
          collection: [{
            category: 'addiction medicine',
            version: '1',
            date: arbitraryDate().toISOString(),
          }],
        })
        : ({ collection: [] })),
      logger: dummyLogger,
    };

    let result: SubjectArea;

    beforeEach(async () => {
      result = await pipe(
        arbitraryDoi(),
        getBiorxivOrMedrxivSubjectArea(ports),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns the subject area', () => {
      expect(result.value).toBe('addiction medicine');
    });
  });

  describe('when there are multiple article versions', () => {
    const ports = {
      getJson: async (url: string) => (url.includes('/medrxiv')
        ? ({
          collection: [
            {
              category: 'allergy and immunology',
              version: '1',
              date: arbitraryDate().toISOString(),
            },
            {
              category: 'addiction medicine',
              version: '2',
              date: arbitraryDate().toISOString(),
            },
          ],
        })
        : ({ collection: [] })),
      logger: dummyLogger,
    };
    let result: SubjectArea;

    beforeEach(async () => {
      result = await pipe(
        arbitraryDoi(),
        getBiorxivOrMedrxivSubjectArea(ports),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns the subject area', () => {
      expect(result.value).toBe('addiction medicine');
    });
  });

  describe('when no usable response is decoded', () => {
    const ports = {
      getJson: async () => ({}),
      logger: dummyLogger,
    };
    let result: E.Either<DE.DataError, SubjectArea>;

    beforeEach(async () => {
      result = await getBiorxivOrMedrxivSubjectArea(ports)(arbitraryDoi())();
    });

    it('returns a left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});
