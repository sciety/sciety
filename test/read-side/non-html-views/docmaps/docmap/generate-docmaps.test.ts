import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { DependenciesForViews } from '../../../../../src/read-side/dependencies-for-views';
import { Docmap } from '../../../../../src/read-side/non-html-views/docmaps/docmap/docmap-type';
import { generateDocmaps } from '../../../../../src/read-side/non-html-views/docmaps/docmap/generate-docmaps';
import * as DE from '../../../../../src/types/data-error';
import { EvaluationLocator } from '../../../../../src/types/evaluation-locator';
import * as GID from '../../../../../src/types/group-id';
import { RecordEvaluationPublicationCommand } from '../../../../../src/write-side/commands/record-evaluation-publication';
import { abortTest } from '../../../../abort-test';
import { TestFramework, createTestFramework } from '../../../../framework';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { arbitraryNcrcId } from '../../../../types/evaluation-locator.helper';
import { arbitraryExpressionDoi } from '../../../../types/expression-doi.helper';
import { arbitraryAddGroupCommand } from '../../../../write-side/commands/add-group-command.helper';
import { arbitraryRecordEvaluationPublicationCommand } from '../../../../write-side/commands/record-evaluation-publication-command.helper';

describe('generate-docmaps', () => {
  const expressionDoi = arbitraryExpressionDoi();
  const ncrcGroupId = GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a');
  const rapidReviewsGroupId = GID.fromValidatedString('5142a5bc-6b18-42b1-9a8d-7342d7d17e94');
  let framework: TestFramework;
  let defaultDependencies: DependenciesForViews;

  beforeEach(async () => {
    framework = createTestFramework();
    defaultDependencies = framework.dependenciesForViews;
  });

  describe('when the article hasn\'t been evaluated', () => {
    let response: { status: StatusCodes, message: string };

    beforeEach(async () => {
      response = await pipe(
        arbitraryExpressionDoi(),
        generateDocmaps(defaultDependencies),
        TE.match(identity, abortTest('generateDocmaps returned on the right')),
      )();
    });

    it('returns a 404 http status code', () => {
      expect(response.status).toStrictEqual(StatusCodes.NOT_FOUND);
    });

    it('returns an error message', () => {
      expect(response.message).toBe('No Docmaps available for requested DOI');
    });
  });

  describe('when the article has been evaluated only by unsupported groups', () => {
    const addGroup1 = arbitraryAddGroupCommand();
    const addGroup2 = arbitraryAddGroupCommand();
    const command1 = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      groupId: addGroup1.groupId,
    };
    const command2 = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      groupId: addGroup2.groupId,
    };

    let response: { status: StatusCodes, message: string };

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroup1);
      await framework.commandHelpers.addGroup(addGroup2);
      await framework.commandHelpers.recordEvaluationPublication(command1);
      await framework.commandHelpers.recordEvaluationPublication(command2);
      response = await pipe(
        expressionDoi,
        generateDocmaps(defaultDependencies),
        TE.match(identity, abortTest('generateDocmaps returned on the right')),
      )();
    });

    it('returns a 404 http status code', () => {
      expect(response.status).toStrictEqual(StatusCodes.NOT_FOUND);
    });

    it('returns an error message', () => {
      expect(response.message).toBe('No Docmaps available for requested DOI');
    });
  });

  describe('when the article has been evaluated by one supported group', () => {
    let docmaps: ReadonlyArray<Docmap>;

    beforeEach(async () => {
      const addGroupCommand = {
        ...arbitraryAddGroupCommand(),
        groupId: ncrcGroupId,
      };
      const command: RecordEvaluationPublicationCommand = {
        ...arbitraryRecordEvaluationPublicationCommand(),
        groupId: addGroupCommand.groupId,
        expressionDoi,
      };
      await framework.commandHelpers.addGroup(addGroupCommand);
      await framework.commandHelpers.recordEvaluationPublication(command);
      docmaps = await pipe(
        expressionDoi,
        generateDocmaps(defaultDependencies),
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
      const addGroup1 = {
        ...arbitraryAddGroupCommand(),
        groupId: ncrcGroupId,
      };
      const addGroup2 = arbitraryAddGroupCommand();
      const recordEvaluation1: RecordEvaluationPublicationCommand = {
        ...arbitraryRecordEvaluationPublicationCommand(),
        groupId: addGroup1.groupId,
        expressionDoi,
      };
      const recordEvaluation2: RecordEvaluationPublicationCommand = {
        ...arbitraryRecordEvaluationPublicationCommand(),
        groupId: addGroup2.groupId,
        expressionDoi,
      };
      await framework.commandHelpers.addGroup(addGroup1);
      await framework.commandHelpers.addGroup(addGroup2);
      await framework.commandHelpers.recordEvaluationPublication(recordEvaluation1);
      await framework.commandHelpers.recordEvaluationPublication(recordEvaluation2);
      docmaps = await pipe(
        expressionDoi,
        generateDocmaps(defaultDependencies),
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
      const addGroup1 = {
        ...arbitraryAddGroupCommand(),
        groupId: ncrcGroupId,
      };
      const addGroup2 = {
        ...arbitraryAddGroupCommand(),
        groupId: rapidReviewsGroupId,
      };
      const recordEvaluation1: RecordEvaluationPublicationCommand = {
        ...arbitraryRecordEvaluationPublicationCommand(),
        groupId: addGroup1.groupId,
        expressionDoi,
      };
      const recordEvaluation2: RecordEvaluationPublicationCommand = {
        ...arbitraryRecordEvaluationPublicationCommand(),
        groupId: addGroup2.groupId,
        expressionDoi,
      };
      await framework.commandHelpers.addGroup(addGroup1);
      await framework.commandHelpers.addGroup(addGroup2);
      await framework.commandHelpers.recordEvaluationPublication(recordEvaluation1);
      await framework.commandHelpers.recordEvaluationPublication(recordEvaluation2);
      docmaps = await pipe(
        expressionDoi,
        generateDocmaps(defaultDependencies),
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
      const addGroupCommand = {
        ...arbitraryAddGroupCommand(),
        groupId: ncrcGroupId,
      };
      const recordEvaluation1: RecordEvaluationPublicationCommand = {
        ...arbitraryRecordEvaluationPublicationCommand(),
        groupId: addGroupCommand.groupId,
        expressionDoi,
      };
      const recordEvaluation2: RecordEvaluationPublicationCommand = {
        ...arbitraryRecordEvaluationPublicationCommand(),
        groupId: addGroupCommand.groupId,
        expressionDoi,
      };
      await framework.commandHelpers.addGroup(addGroupCommand);
      await framework.commandHelpers.recordEvaluationPublication(recordEvaluation1);
      await framework.commandHelpers.recordEvaluationPublication(recordEvaluation2);
      docmaps = await pipe(
        expressionDoi,
        generateDocmaps(defaultDependencies),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns an array containing a single docmap for that group', () => {
      expect(docmaps).toHaveLength(1);
    });
  });

  describe('when any docmap fails', () => {
    let response: { status: StatusCodes, message: string };

    beforeEach(async () => {
      const addGroupCommand = {
        ...arbitraryAddGroupCommand(),
        groupId: ncrcGroupId,
      };
      const failingReviewId = arbitraryNcrcId();
      const recordGoodEvaluation: RecordEvaluationPublicationCommand = {
        ...arbitraryRecordEvaluationPublicationCommand(),
        groupId: addGroupCommand.groupId,
        expressionDoi,
      };
      const recordBadEvaluation: RecordEvaluationPublicationCommand = {
        ...arbitraryRecordEvaluationPublicationCommand(),
        groupId: addGroupCommand.groupId,
        expressionDoi,
        evaluationLocator: failingReviewId,
      };
      await framework.commandHelpers.addGroup(addGroupCommand);
      await framework.commandHelpers.recordEvaluationPublication(recordGoodEvaluation);
      await framework.commandHelpers.recordEvaluationPublication(recordBadEvaluation);
      response = await pipe(
        expressionDoi,
        generateDocmaps({
          ...defaultDependencies,
          fetchEvaluationHumanReadableOriginalUrl: (id: EvaluationLocator) => (
            id === failingReviewId
              ? TE.left(DE.notFound)
              : TE.right(new URL(`https://reviews.example.com/${id}`))
          ),
        }),
        TE.match(identity, abortTest('generateDocmaps returned on the right')),
      )();
    });

    it('returns a 500 http status code', () => {
      expect(response.status).toStrictEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    it('returns an error message', () => {
      expect(response.message).toBe('Failed to generate docmaps');
    });
  });

  describe('when the doi can\'t be decoded', () => {
    let response: { status: StatusCodes, message: string };

    beforeEach(async () => {
      response = await pipe(
        ('not-a-doi'),
        generateDocmaps(defaultDependencies),
        TE.match(identity, abortTest('generateDocmaps returned on the right')),
      )();
    });

    it('returns a 400 http status code', () => {
      expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
    });

    it('returns an error message', () => {
      expect(response.message).toBe('Invalid DOI requested');
    });
  });
});
