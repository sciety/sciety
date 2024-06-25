import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { identity } from 'io-ts';
import { publisherAccountId } from '../../../../../src/read-side/non-html-views/docmaps/docmap/publisher-account-id';
import { constructViewModel } from '../../../../../src/read-side/non-html-views/docmaps/docmap-index/construct-view-model';
import * as ER from '../../../../../src/read-side/non-html-views/docmaps/docmap-index/error-response';
import { Params } from '../../../../../src/read-side/non-html-views/docmaps/docmap-index/params';
import { supportedGroups } from '../../../../../src/read-side/non-html-views/docmaps/supported-groups';
import { TestFramework, createTestFramework } from '../../../../framework';
import { arbitraryString } from '../../../../helpers';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { arbitraryEvaluationLocator } from '../../../../types/evaluation-locator.helper';
import { arbitraryExpressionDoi } from '../../../../types/expression-doi.helper';
import { arbitraryGroupId } from '../../../../types/group-id.helper';
import { arbitraryAddGroupCommand } from '../../../../write-side/commands/add-group-command.helper';
import { arbitraryRecordEvaluationPublicationCommand } from '../../../../write-side/commands/record-evaluation-publication-command.helper';

describe('construct-view-model', () => {
  const defaultParams: Params = {
    updatedAfter: O.none,
    publisheraccount: O.none,
  };
  let framework: TestFramework;
  let docmapArticleIds: ReadonlyArray<string>;

  const getDocmapsExpressionDois = async (params: Params) => pipe(
    params,
    constructViewModel(framework.dependenciesForViews),
    TE.getOrElse(framework.abortTest('constructDocmapIndexViewModel')),
    T.map(RA.map((docmap) => docmap.expressionDoi)),
  )();

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when there are no docmaps', () => {
    beforeEach(async () => {
      docmapArticleIds = await getDocmapsExpressionDois(defaultParams);
    });

    it('returns an empty list', () => {
      expect(docmapArticleIds).toStrictEqual([]);
    });
  });

  describe('when only supported groups are involved', () => {
    const groupId1 = supportedGroups[0];
    const groupId2 = supportedGroups[1];

    describe('when a single group has evaluated multiple articles', () => {
      const expressionDoi1 = arbitraryExpressionDoi();
      const expressionDoi2 = arbitraryExpressionDoi();

      beforeEach(async () => {
        await framework.commandHelpers.addGroup({
          ...arbitraryAddGroupCommand(),
          groupId: groupId1,
        });
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          expressionDoi: expressionDoi1,
          groupId: groupId1,
        });
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          expressionDoi: expressionDoi2,
          groupId: groupId1,
        });
        docmapArticleIds = await getDocmapsExpressionDois(defaultParams);
      });

      it('returns a docmap for every evaluated article', () => {
        expect(docmapArticleIds).toHaveLength(2);
        expect(docmapArticleIds).toContain(expressionDoi1);
        expect(docmapArticleIds).toContain(expressionDoi2);
      });
    });

    describe('when multiple groups have evaluated a single article', () => {
      const expressionDoi = arbitraryExpressionDoi();

      beforeEach(async () => {
        await framework.commandHelpers.addGroup({
          ...arbitraryAddGroupCommand(),
          groupId: groupId1,
        });
        await framework.commandHelpers.addGroup({
          ...arbitraryAddGroupCommand(),
          groupId: groupId2,
        });
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          expressionDoi,
          groupId: groupId1,
        });
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          expressionDoi,
          groupId: groupId2,
        });
        docmapArticleIds = await getDocmapsExpressionDois(defaultParams);
      });

      it('returns a docmap for every group', () => {
        expect(docmapArticleIds).toStrictEqual([expressionDoi, expressionDoi]);
      });
    });

    describe('when multiple groups have evaluated multiple articles', () => {
      const expressionDoi1 = arbitraryExpressionDoi();
      const expressionDoi2 = arbitraryExpressionDoi();

      beforeEach(async () => {
        await framework.commandHelpers.addGroup({
          ...arbitraryAddGroupCommand(),
          groupId: groupId1,
        });
        await framework.commandHelpers.addGroup({
          ...arbitraryAddGroupCommand(),
          groupId: groupId2,
        });
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          expressionDoi: expressionDoi1,
          groupId: groupId1,
        });
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          expressionDoi: expressionDoi1,
          groupId: groupId2,
        });
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          expressionDoi: expressionDoi2,
          groupId: groupId2,
        });
        docmapArticleIds = await getDocmapsExpressionDois(defaultParams);
      });

      it('returns a docmap for every combination of group and evaluated article', () => {
        expect(docmapArticleIds).toContain(expressionDoi1);
        expect(docmapArticleIds).toContain(expressionDoi2);
        expect(docmapArticleIds).toHaveLength(3);
      });
    });
  });

  describe('when an unsupported group is involved', () => {
    const groupId = arbitraryGroupId();

    beforeEach(async () => {
      await framework.commandHelpers.addGroup({
        ...arbitraryAddGroupCommand(),
        groupId,
      });
      await framework.commandHelpers.recordEvaluationPublication({
        ...arbitraryRecordEvaluationPublicationCommand(),
        groupId,
      });
      docmapArticleIds = await getDocmapsExpressionDois(defaultParams);
    });

    it('excludes articles evaluated by the unsupported group', () => {
      expect(docmapArticleIds).toStrictEqual([]);
    });
  });

  describe('when a supported group\'s details cannot be obtained', () => {
    const recordEvaluationPublicationCommand = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      groupId: supportedGroups[0],
    };
    let result: ER.ErrorResponse;

    beforeEach(async () => {
      await framework.commandHelpers.recordEvaluationPublication(recordEvaluationPublicationCommand);
      result = await pipe(
        defaultParams,
        constructViewModel(framework.dependenciesForViews),
        TE.match(
          identity,
          shouldNotBeCalled,
        ),
      )();
    });

    it('fails with an internal server error', () => {
      expect(result.status).toStrictEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe('filtering', () => {
    describe('when the whole index is requested', () => {
      const expressionDoi1 = arbitraryExpressionDoi();
      const expressionDoi2 = arbitraryExpressionDoi();
      const groupId1 = supportedGroups[0];
      const groupId2 = supportedGroups[1];

      beforeEach(async () => {
        await framework.commandHelpers.addGroup({
          ...arbitraryAddGroupCommand(),
          groupId: groupId1,
        });
        await framework.commandHelpers.addGroup({
          ...arbitraryAddGroupCommand(),
          groupId: groupId2,
        });
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          expressionDoi: expressionDoi1,
          groupId: groupId1,
        });
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          expressionDoi: expressionDoi2,
          groupId: groupId2,
        });
        docmapArticleIds = await getDocmapsExpressionDois(defaultParams);
      });

      it('returns all docmaps', () => {
        expect(docmapArticleIds).toHaveLength(2);
        expect(docmapArticleIds).toContain(expressionDoi1);
        expect(docmapArticleIds).toContain(expressionDoi2);
      });
    });

    describe('when a particular publisher account ID is requested', () => {
      const expressionDoi = arbitraryExpressionDoi();
      const groupId1 = supportedGroups[0];
      const addGroup1Command = {
        ...arbitraryAddGroupCommand(),
        groupId: groupId1,
      };
      const groupId2 = supportedGroups[1];

      beforeEach(async () => {
        await framework.commandHelpers.addGroup(addGroup1Command);
        await framework.commandHelpers.addGroup({
          ...arbitraryAddGroupCommand(),
          groupId: groupId2,
        });
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          expressionDoi,
          groupId: groupId1,
        });
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          groupId: groupId2,
        });
        docmapArticleIds = await getDocmapsExpressionDois({
          ...defaultParams,
          publisheraccount: O.some(publisherAccountId(addGroup1Command)),
        });
      });

      it('only returns docmaps by the corresponding group', () => {
        expect(docmapArticleIds).toStrictEqual([expressionDoi]);
      });
    });

    describe('when only docmaps updated after a certain date are requested', () => {
      describe('when one evaluation has been recorded before that date and another has been recorded after that date', () => {
        const relevantExpressionDoi = arbitraryExpressionDoi();
        const groupId = supportedGroups[0];

        beforeEach(async () => {
          await framework.commandHelpers.addGroup({
            ...arbitraryAddGroupCommand(),
            groupId,
          });
          await framework.commandHelpers.recordEvaluationPublication({
            ...arbitraryRecordEvaluationPublicationCommand(),
            issuedAt: new Date('1980-01-01'),
            groupId,
          });
          await framework.commandHelpers.recordEvaluationPublication({
            ...arbitraryRecordEvaluationPublicationCommand(),
            expressionDoi: relevantExpressionDoi,
            issuedAt: new Date('2000-01-01'),
            groupId,
          });
          docmapArticleIds = await getDocmapsExpressionDois({
            ...defaultParams,
            updatedAfter: O.some(new Date('1990-01-01')),
          });
        });

        it('returns the docmap whose updated property is after the specified date', () => {
          expect(docmapArticleIds).toStrictEqual([relevantExpressionDoi]);
        });
      });

      describe('when one evaluation has been recorded before that date and then updated after that date', () => {
        const relevantExpressionDoi = arbitraryExpressionDoi();
        const groupId = supportedGroups[0];
        const evaluationLocator = arbitraryEvaluationLocator();

        beforeEach(async () => {
          await framework.commandHelpers.addGroup({
            ...arbitraryAddGroupCommand(),
            groupId,
          });
          await framework.commandHelpers.recordEvaluationPublication({
            ...arbitraryRecordEvaluationPublicationCommand(),
            expressionDoi: relevantExpressionDoi,
            evaluationLocator,
            issuedAt: new Date('1980-01-01'),
            groupId,
          });
          await framework.commandHelpers.updateEvaluation({
            evaluationLocator,
            authors: [arbitraryString()],
            issuedAt: new Date('2000-01-01'),
          });
          docmapArticleIds = await getDocmapsExpressionDois({
            ...defaultParams,
            updatedAfter: O.some(new Date('1990-01-01')),
          });
        });

        it('returns that docmap', () => {
          expect(docmapArticleIds).toStrictEqual([relevantExpressionDoi]);
        });
      });
    });
  });
});
