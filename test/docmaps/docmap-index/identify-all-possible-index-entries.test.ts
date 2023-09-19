import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import {
  DocmapIndexEntryModel,
  Ports,
  identifyAllPossibleIndexEntries,
} from '../../../src/docmaps/docmap-index/identify-all-possible-index-entries';
import { publisherAccountId } from '../../../src/docmaps/docmap/publisher-account-id';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { createTestFramework, TestFramework } from '../../framework';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryRecordedEvaluation } from '../../types/recorded-evaluation.helper';
import { RecordedEvaluation } from '../../../src/types/recorded-evaluation';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryAddGroupCommand } from '../../write-side/commands/add-group-command.helper';
import { arbitraryRecordEvaluationPublicationCommand } from '../../write-side/commands/record-evaluation-publication-command.helper';

describe('identify-all-possible-index-entries', () => {
  const supportedGroupCommands = [
    arbitraryAddGroupCommand(),
    arbitraryAddGroupCommand(),
  ];
  const supportedGroupIds = supportedGroupCommands.map((cmd) => cmd.groupId);

  let framework: TestFramework;
  let defaultAdapters: Ports;

  beforeEach(async () => {
    framework = createTestFramework();
    defaultAdapters = {
      ...framework.queries,
      logger: dummyLogger,
    };
  });

  describe('when a supported group has evaluated multiple articles', () => {
    const command1 = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      groupId: supportedGroupIds[0],
    };
    const command2 = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      groupId: supportedGroupIds[0],
    };
    let evaluation1: RecordedEvaluation;
    let evaluation2: RecordedEvaluation;
    let result: ReadonlyArray<DocmapIndexEntryModel>;

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(supportedGroupCommands[0]);
      await framework.commandHelpers.recordEvaluationPublication(command1);
      evaluation1 = framework.queries.getEvaluationsForDoi(command1.articleId)[0];
      await T.delay(10)(async () => framework.commandHelpers.recordEvaluationPublication(command2))();
      evaluation2 = framework.queries.getEvaluationsForDoi(command2.articleId)[0];
      result = pipe(
        identifyAllPossibleIndexEntries(supportedGroupIds, defaultAdapters),
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it('returns a list of all the evaluated index entry models', () => {
      expect(result).toStrictEqual([
        {
          articleId: command2.articleId,
          groupId: command2.groupId,
          updated: evaluation2.recordedAt,
          publisherAccountId: publisherAccountId(supportedGroupCommands[0]),
        },
        {
          articleId: command1.articleId,
          groupId: command1.groupId,
          updated: evaluation1.recordedAt,
          publisherAccountId: publisherAccountId(supportedGroupCommands[0]),
        },
      ]);
    });
  });

  describe('when a supported group has evaluated an article multiple times', () => {
    const articleId = arbitraryArticleId();
    const command1: RecordedEvaluation = {
      ...arbitraryRecordedEvaluation(),
      groupId: supportedGroupIds[0],
      articleId,
    };
    const command2: RecordedEvaluation = {
      ...arbitraryRecordedEvaluation(),
      groupId: supportedGroupIds[0],
      articleId,
    };
    const command3: RecordedEvaluation = {
      ...arbitraryRecordedEvaluation(),
      groupId: supportedGroupIds[0],
      articleId,
    };
    let evaluation3: RecordedEvaluation;
    let result: ReadonlyArray<DocmapIndexEntryModel>;

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(supportedGroupCommands[0]);
      await framework.commandHelpers.recordEvaluationPublication(command1);
      await T.delay(10)(async () => framework.commandHelpers.recordEvaluationPublication(command2))();
      await T.delay(10)(async () => framework.commandHelpers.recordEvaluationPublication(command3))();
      evaluation3 = framework.queries.getEvaluationsForDoi(command3.articleId)[2];
      result = pipe(
        identifyAllPossibleIndexEntries(supportedGroupIds, defaultAdapters),
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it('returns the latest updated date', () => {
      expect(result).toStrictEqual([
        expect.objectContaining({
          updated: evaluation3.recordedAt,
        }),
      ]);
    });
  });

  describe('when there is an evaluated event by an unsupported group', () => {
    const addGroupCommand = arbitraryAddGroupCommand();
    const evaluation = {
      ...arbitraryRecordedEvaluation(),
      groupId: addGroupCommand.groupId,
    };
    let result: ReadonlyArray<DocmapIndexEntryModel>;

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
      await framework.commandHelpers.recordEvaluationPublication(evaluation);
      result = pipe(
        identifyAllPossibleIndexEntries(supportedGroupIds, defaultAdapters),
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it('excludes articles evaluated by the unsupported group', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('when a supported group cannot be fetched', () => {
    const evaluation = {
      ...arbitraryRecordedEvaluation(),
      groupId: supportedGroupIds[0],
    };
    let result: ReturnType<typeof identifyAllPossibleIndexEntries>;

    beforeEach(async () => {
      await framework.commandHelpers.recordEvaluationPublication(evaluation);
      result = pipe(
        identifyAllPossibleIndexEntries(supportedGroupIds, defaultAdapters),
      );
    });

    it('fails with an internal server error', () => {
      expect(result).toStrictEqual(E.left(expect.objectContaining({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      })));
    });
  });
});
