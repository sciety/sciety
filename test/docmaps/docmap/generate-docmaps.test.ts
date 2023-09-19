import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { generateDocmaps } from '../../../src/docmaps/docmap';
import { Ports } from '../../../src/docmaps/docmap/generate-docmaps';
import { Docmap } from '../../../src/docmaps/docmap/docmap-type';
import * as DE from '../../../src/types/data-error';
import * as GID from '../../../src/types/group-id';
import { EvaluationLocator } from '../../../src/types/evaluation-locator';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryNcrcId } from '../../types/evaluation-locator.helper';
import { TestFramework, createTestFramework } from '../../framework';
import { arbitraryRecordedEvaluation } from '../../types/recorded-evaluation.helper';
import { RecordedEvaluation } from '../../../src/types/recorded-evaluation';

describe('generate-docmaps', () => {
  const articleId = arbitraryArticleId();
  const ncrcGroupId = GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a');
  const rapidReviewsGroupId = GID.fromValidatedString('5142a5bc-6b18-42b1-9a8d-7342d7d17e94');
  let framework: TestFramework;
  let defaultAdapters: Ports;

  beforeEach(async () => {
    framework = createTestFramework();
    defaultAdapters = {
      ...framework.queries,
      ...framework.happyPathThirdParties,
    };
  });

  describe('when the article hasn\'t been evaluated', () => {
    let response: E.Either<{ status: StatusCodes }, ReadonlyArray<Docmap>>;

    beforeEach(async () => {
      response = await pipe(
        arbitraryArticleId().value,
        generateDocmaps(defaultAdapters),
      )();
    });

    it('returns a 404 http status code', () => {
      expect(response).toStrictEqual(E.left(expect.objectContaining({ status: StatusCodes.NOT_FOUND })));
    });

    it('returns an error message', () => {
      expect(response).toStrictEqual(E.left(expect.objectContaining({ message: 'No Docmaps available for requested DOI' })));
    });
  });

  describe('when the article has been evaluated only by unsupported groups', () => {
    const group1 = arbitraryGroup();
    const group2 = arbitraryGroup();
    const evaluation1 = {
      ...arbitraryRecordedEvaluation(),
      groupId: group1.id,
    };
    const evaluation2 = {
      ...arbitraryRecordedEvaluation(),
      groupId: group2.id,
    };

    let response: E.Either<{ status: StatusCodes }, ReadonlyArray<Docmap>>;

    beforeEach(async () => {
      await framework.commandHelpers.deprecatedCreateGroup(group1);
      await framework.commandHelpers.deprecatedCreateGroup(group2);
      await framework.commandHelpers.recordEvaluationPublication(evaluation1);
      await framework.commandHelpers.recordEvaluationPublication(evaluation2);
      response = await pipe(
        articleId.value,
        generateDocmaps(defaultAdapters),
      )();
    });

    it('returns a 404 http status code', () => {
      expect(response).toStrictEqual(E.left(expect.objectContaining({ status: StatusCodes.NOT_FOUND })));
    });

    it('returns an error message', () => {
      expect(response).toStrictEqual(E.left(expect.objectContaining({ message: 'No Docmaps available for requested DOI' })));
    });
  });

  describe('when the article has been evaluated by one supported group', () => {
    let docmaps: ReadonlyArray<Docmap>;

    beforeEach(async () => {
      const group = {
        ...arbitraryGroup(),
        id: ncrcGroupId,
      };
      const evaluation = {
        ...arbitraryRecordedEvaluation(),
        groupId: group.id,
        articleId,
      };
      await framework.commandHelpers.deprecatedCreateGroup(group);
      await framework.commandHelpers.recordEvaluationPublication(evaluation);
      docmaps = await pipe(
        articleId.value,
        generateDocmaps(defaultAdapters),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns an array containing one docmap', () => {
      expect(docmaps).toHaveLength(1);
    });
  });

  describe('when the article has been evaluated by one supported group and one unsupported group', () => {
    let docmaps: ReadonlyArray<Docmap>;

    beforeEach(async () => {
      const group1 = {
        ...arbitraryGroup(),
        id: ncrcGroupId,
      };
      const group2 = arbitraryGroup();
      const evaluation1 = {
        ...arbitraryRecordedEvaluation(),
        groupId: group1.id,
        articleId,
      };
      const evaluation2 = {
        ...arbitraryRecordedEvaluation(),
        groupId: group2.id,
        articleId,
      };
      await framework.commandHelpers.deprecatedCreateGroup(group1);
      await framework.commandHelpers.deprecatedCreateGroup(group2);
      await framework.commandHelpers.recordEvaluationPublication(evaluation1);
      await framework.commandHelpers.recordEvaluationPublication(evaluation2);
      docmaps = await pipe(
        articleId.value,
        generateDocmaps(defaultAdapters),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns an array containing one docmap from the supported group', () => {
      expect(docmaps).toHaveLength(1);
    });
  });

  describe('when the article has been evaluated by two supported groups', () => {
    let docmaps: ReadonlyArray<Docmap>;

    beforeEach(async () => {
      const group1 = {
        ...arbitraryGroup(),
        id: ncrcGroupId,
      };
      const group2 = {
        ...arbitraryGroup(),
        id: rapidReviewsGroupId,
      };
      const evaluation1 = {
        ...arbitraryRecordedEvaluation(),
        groupId: group1.id,
        articleId,
      };
      const evaluation2 = {
        ...arbitraryRecordedEvaluation(),
        groupId: group2.id,
        articleId,
      };
      await framework.commandHelpers.deprecatedCreateGroup(group1);
      await framework.commandHelpers.deprecatedCreateGroup(group2);
      await framework.commandHelpers.recordEvaluationPublication(evaluation1);
      await framework.commandHelpers.recordEvaluationPublication(evaluation2);
      docmaps = await pipe(
        articleId.value,
        generateDocmaps(defaultAdapters),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns an array containing a docmap for each group', () => {
      expect(docmaps).toHaveLength(2);
      expect(docmaps[0].publisher.account.id).not.toBe(
        docmaps[1].publisher.account.id,
      );
    });
  });

  describe('when the article has been evaluated multiple times by the same group', () => {
    let docmaps: ReadonlyArray<Docmap>;

    beforeEach(async () => {
      const group = {
        ...arbitraryGroup(),
        id: ncrcGroupId,
      };
      const evaluation1 = {
        ...arbitraryRecordedEvaluation(),
        groupId: group.id,
        articleId,
      };
      const evaluation2 = {
        ...arbitraryRecordedEvaluation(),
        groupId: group.id,
        articleId,
      };
      await framework.commandHelpers.deprecatedCreateGroup(group);
      await framework.commandHelpers.recordEvaluationPublication(evaluation1);
      await framework.commandHelpers.recordEvaluationPublication(evaluation2);
      docmaps = await pipe(
        articleId.value,
        generateDocmaps(defaultAdapters),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns an array containing a single docmap for that group', () => {
      expect(docmaps).toHaveLength(1);
    });
  });

  describe('when any docmap fails', () => {
    let response: E.Either<{ status: StatusCodes, message: string }, ReadonlyArray<Docmap>>;

    beforeEach(async () => {
      const group = {
        ...arbitraryGroup(),
        id: ncrcGroupId,
      };
      const failingReviewId = arbitraryNcrcId();
      const goodEvaluation: RecordedEvaluation = {
        ...arbitraryRecordedEvaluation(),
        groupId: group.id,
        articleId,
      };
      const badEvaluation: RecordedEvaluation = {
        ...arbitraryRecordedEvaluation(),
        groupId: group.id,
        articleId,
        evaluationLocator: failingReviewId,
      };
      await framework.commandHelpers.deprecatedCreateGroup(group);
      await framework.commandHelpers.recordEvaluationPublication(goodEvaluation);
      await framework.commandHelpers.recordEvaluationPublication(badEvaluation);
      response = await pipe(
        generateDocmaps({
          ...defaultAdapters,
          fetchReview: (id: EvaluationLocator) => (
            id === failingReviewId
              ? TE.left(DE.notFound)
              : TE.right({ url: new URL(`https://reviews.example.com/${id}`) })
          ),
        })(articleId.value),
      )();
    });

    it('returns a 500 http status code', () => {
      expect(response).toStrictEqual(E.left(expect.objectContaining({ status: StatusCodes.INTERNAL_SERVER_ERROR })));
    });

    it('returns an error message', () => {
      expect(response).toStrictEqual(E.left(expect.objectContaining({ message: 'Failed to generate docmaps' })));
    });
  });

  describe('when the doi can\'t be decoded', () => {
    let response: E.Either<{ status: StatusCodes }, ReadonlyArray<Docmap>>;

    beforeEach(async () => {
      response = await pipe(
        generateDocmaps(defaultAdapters)('not-a-doi'),
      )();
    });

    it('returns a 400 http status code', () => {
      expect(response).toStrictEqual(E.left(expect.objectContaining({ status: StatusCodes.BAD_REQUEST })));
    });

    it('returns an error message', () => {
      expect(response).toStrictEqual(E.left(expect.objectContaining({ message: 'Invalid DOI requested' })));
    });
  });
});
