import { StatusCodes } from 'http-status-codes';
import { docmapIndex } from '../../../../../src/read-side/non-html-views/docmaps/docmap-index';
import { Dependencies } from '../../../../../src/read-side/non-html-views/docmaps/docmap-index/dependencies';
import * as GID from '../../../../../src/types/group-id';
import { dummyLogger } from '../../../../dummy-logger';
import { TestFramework, createTestFramework } from '../../../../framework';
import { arbitraryRecordEvaluationPublicationCommand } from '../../../../write-side/commands/record-evaluation-publication-command.helper';

describe('docmap-index', () => {
  const ncrcGroupId = GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a');
  type DocmapIndexBody = {
    articles?: ReadonlyArray<unknown>,
    error?: string,
  };
  let framework: TestFramework;
  let defaultDependencies: Dependencies;

  beforeEach(async () => {
    framework = createTestFramework();
    defaultDependencies = {
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
      response = await docmapIndex(defaultDependencies)({})();
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
      response = await docmapIndex(defaultDependencies)({
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
