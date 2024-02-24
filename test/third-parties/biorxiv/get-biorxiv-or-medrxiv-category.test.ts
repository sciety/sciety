import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as EDOI from '../../../src/types/expression-doi.js';
import { getBiorxivOrMedrxivCategory } from '../../../src/third-parties/biorxiv/get-biorxiv-or-medrxiv-category.js';
import * as DE from '../../../src/types/data-error.js';
import { SubjectArea } from '../../../src/types/subject-area.js';
import { dummyLogger } from '../../dummy-logger.js';
import { arbitraryDate } from '../../helpers.js';
import { shouldNotBeCalled } from '../../should-not-be-called.js';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper.js';

describe('get-biorxiv-or-medrxiv-category', () => {
  describe('when the subject area is available on biorxiv', () => {
    const subjectArea = 'cell biology';
    const ports = {
      queryExternalService: () => (url: string) => TE.right((url.includes('/biorxiv')
        ? ({
          collection: [{
            category: subjectArea,
            version: '1',
            date: arbitraryDate().toISOString(),
            server: 'biorxiv',
          }],
        })
        : ({ collection: [] }))),
      logger: dummyLogger,
    };
    let result: SubjectArea;

    beforeEach(async () => {
      result = await pipe(
        arbitraryExpressionDoi(),
        getBiorxivOrMedrxivCategory(ports),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns the subject area', () => {
      expect(result.value).toStrictEqual(subjectArea);
    });

    it('returns the server', () => {
      expect(result.server).toBe('biorxiv');
    });
  });

  describe('when the subject area is available on medrxiv', () => {
    const subjectArea = 'addiction medicine';
    const ports = {
      queryExternalService: () => (url: string) => TE.right((url.includes('/medrxiv')
        ? ({
          collection: [{
            category: subjectArea,
            version: '1',
            date: arbitraryDate().toISOString(),
            server: 'medrxiv',
          }],
        })
        : ({ collection: [] }))),
      logger: dummyLogger,
    };
    let result: SubjectArea;

    beforeEach(async () => {
      result = await pipe(
        arbitraryExpressionDoi(),
        getBiorxivOrMedrxivCategory(ports),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns the subject area', () => {
      expect(result.value).toStrictEqual(subjectArea);
    });

    it('returns the server', () => {
      expect(result.server).toBe('medrxiv');
    });
  });

  describe('when the subject area is not available on either server', () => {
    const ports = {
      queryExternalService: () => () => TE.right({ collection: [] }),
      logger: dummyLogger,
    };
    let result: E.Either<DE.DataError, SubjectArea>;

    beforeEach(async () => {
      result = await getBiorxivOrMedrxivCategory(ports)(arbitraryExpressionDoi())();
    });

    it('returns a left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('when one article version is returned', () => {
    const ports = {
      queryExternalService: () => (url: string) => TE.right((url.includes('/medrxiv')
        ? ({
          collection: [{
            category: 'addiction medicine',
            version: '1',
            date: arbitraryDate().toISOString(),
            server: 'medrxiv',
          }],
        })
        : ({ collection: [] }))),
      logger: dummyLogger,
    };

    let result: SubjectArea;

    beforeEach(async () => {
      result = await pipe(
        arbitraryExpressionDoi(),
        getBiorxivOrMedrxivCategory(ports),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns the subject area', () => {
      expect(result.value).toBe('addiction medicine');
    });
  });

  describe('when there are multiple article versions', () => {
    const ports = {
      queryExternalService: () => (url: string) => TE.right((url.includes('/medrxiv')
        ? ({
          collection: [
            {
              category: 'allergy and immunology',
              version: '1',
              date: arbitraryDate().toISOString(),
              server: 'medrxiv',
            },
            {
              category: 'addiction medicine',
              version: '2',
              date: arbitraryDate().toISOString(),
              server: 'medrxiv',
            },
          ],
        })
        : ({ collection: [] }))),
      logger: dummyLogger,
    };
    let result: SubjectArea;

    beforeEach(async () => {
      result = await pipe(
        arbitraryExpressionDoi(),
        getBiorxivOrMedrxivCategory(ports),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns the subject area', () => {
      expect(result.value).toBe('addiction medicine');
    });
  });

  describe('when no usable response is decoded', () => {
    const ports = {
      queryExternalService: () => () => TE.right({}),
      logger: dummyLogger,
    };
    let result: E.Either<DE.DataError, SubjectArea>;

    beforeEach(async () => {
      result = await getBiorxivOrMedrxivCategory(ports)(arbitraryExpressionDoi())();
    });

    it('returns a left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('when the article doi has a prefix that is not supported', () => {
    const researchSquareArticleDoi = EDOI.fromValidatedString('10.21203/rs.3.rs-2197876/v1');
    const logger = jest.fn(dummyLogger);
    const ports = {
      queryExternalService: shouldNotBeCalled,
      logger,
    };
    let result: E.Either<DE.DataError, SubjectArea>;

    beforeEach(async () => {
      result = await getBiorxivOrMedrxivCategory(ports)(researchSquareArticleDoi)();
    });

    it('returns a left', () => {
      expect(E.isLeft(result)).toBe(true);
    });

    it('no error logs are produced', () => {
      expect(logger).toHaveBeenCalledTimes(0);
    });
  });
});
