import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { DependenciesForViews } from '../../../../../src/read-side/dependencies-for-views';
import { docmapIndex } from '../../../../../src/read-side/non-html-views/docmaps/docmap-index';
import { NonHtmlViewError } from '../../../../../src/read-side/non-html-views/non-html-view-error';
import * as GID from '../../../../../src/types/group-id';
import { abortTest } from '../../../../abort-test';
import { TestFramework, createTestFramework } from '../../../../framework';
import { arbitraryRecordEvaluationPublicationCommand } from '../../../../write-side/commands/record-evaluation-publication-command.helper';

describe('docmap-index', () => {
  const ncrcGroupId = GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a');
  let framework: TestFramework;
  let defaultDependencies: DependenciesForViews;

  beforeEach(async () => {
    framework = createTestFramework();
    defaultDependencies = framework.dependenciesForViews;
  });

  describe('when any docmap fails to generate', () => {
    let errorResult: NonHtmlViewError;
    const recordEvaluationPublicationCommand = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      groupId: ncrcGroupId,
    };

    beforeEach(async () => {
      await framework.commandHelpers.recordEvaluationPublication(recordEvaluationPublicationCommand);
      errorResult = await pipe(
        {},
        docmapIndex(defaultDependencies),
        TE.match(identity, abortTest('returned on the right')),
      )();
    });

    it('returns a body containing an error object', () => {
      expect(errorResult.message).toBe('Internal server error while generating Docmaps');
    });

    it('returns a 500 status code', () => {
      expect(errorResult.status).toStrictEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe('when the query parameters are invalid', () => {
    let errorResult: NonHtmlViewError;

    beforeEach(async () => {
      errorResult = await pipe(
        {
          updatedAfter: 'not-a-date',
        },
        docmapIndex(defaultDependencies),
        TE.match(identity, abortTest('returned on the right')),
      )();
    });

    it('returns a body containing an error object', () => {
      expect(errorResult.message).toMatch(/^Invalid value "not-a-date"/);
    });

    it('returns a 400 status code', () => {
      expect(errorResult.status).toStrictEqual(StatusCodes.BAD_REQUEST);
    });
  });
});
