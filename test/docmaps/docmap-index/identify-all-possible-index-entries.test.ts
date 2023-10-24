import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import {
  Ports,
  identifyAllPossibleIndexEntries,
} from '../../../src/docmaps/docmap-index/identify-all-possible-index-entries';
import { createTestFramework, TestFramework } from '../../framework';
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

  describe('when a supported group cannot be fetched', () => {
    const recordEvaluationPublicationCommand = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      groupId: supportedGroupIds[0],
    };
    let result: ReturnType<typeof identifyAllPossibleIndexEntries>;

    beforeEach(async () => {
      await framework.commandHelpers.recordEvaluationPublication(recordEvaluationPublicationCommand);
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
