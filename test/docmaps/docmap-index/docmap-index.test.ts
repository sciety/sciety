import { StatusCodes } from 'http-status-codes';
import { docmapIndex } from '../../../src/docmaps/docmap-index';
import * as GID from '../../../src/types/group-id';
import { Dependencies } from '../../../src/docmaps/docmap-index/docmap-index';
import { TestFramework, createTestFramework } from '../../framework';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryRecordEvaluationPublicationCommand } from '../../write-side/commands/record-evaluation-publication-command.helper';

describe('docmap-index', () => {
  const ncrcGroupId = GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a');
  type DocmapIndexBody = {
    articles?: ReadonlyArray<unknown>,
    error?: string,
  };
  let framework: TestFramework;
  let defaultAdapters: Dependencies;

  beforeEach(async () => {
    framework = createTestFramework();
    defaultAdapters = {
      ...framework.queries,
      ...framework.happyPathThirdParties,
      logger: dummyLogger,
    };
  });

  describe('when any docmap fails to generate', () => {
    let response: { body: DocmapIndexBody, status: StatusCodes };
    const recordEvaluationPublicationCommand = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      groupId: ncrcGroupId,
    };

    beforeEach(async () => {
      await framework.commandHelpers.recordEvaluationPublication(recordEvaluationPublicationCommand);
      response = await docmapIndex(defaultAdapters)({})();
    });

    it('returns a body containing an error object', () => {
      expect(response.body).toStrictEqual({
        error: 'Internal server error while generating Docmaps',
      });
    });

    it('returns a 500 status code', () => {
      expect(response.status).toStrictEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe('when the query parameters are invalid', () => {
    let response: { body: DocmapIndexBody, status: StatusCodes };

    beforeEach(async () => {
      response = await docmapIndex(defaultAdapters)({
        updatedAfter: 'not-a-date',
      })();
    });

    it('returns a body containing an error object', () => {
      expect(response.body.error).toMatch(/^Invalid value "not-a-date"/);
    });

    it('returns a 400 status code', () => {
      expect(response.status).toStrictEqual(StatusCodes.BAD_REQUEST);
    });
  });
});
