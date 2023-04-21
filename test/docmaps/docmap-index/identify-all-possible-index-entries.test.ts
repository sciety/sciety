import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import {
  DocmapIndexEntryModel,
  identifyAllPossibleIndexEntries,
} from '../../../src/docmaps/docmap-index/identify-all-possible-index-entries';
import { publisherAccountId } from '../../../src/docmaps/docmap/publisher-account-id';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { createTestFramework, TestFramework } from '../../framework';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryRecordedEvaluation } from '../../types/recorded-evaluation.helper';
import { RecordedEvaluation } from '../../../src/types/recorded-evaluation';

describe('identify-all-possible-index-entries', () => {
  const supportedGroups = [arbitraryGroup(), arbitraryGroup()];
  const supportedGroupIds = supportedGroups.map((group) => group.id);

  let framework: TestFramework;

  beforeEach(async () => {
    framework = createTestFramework();
  });

  describe('when a supported group has evaluated multiple articles', () => {
    const earlierDate = new Date('1990');
    const laterDate = new Date('2000');
    const evaluation1: RecordedEvaluation = {
      ...arbitraryRecordedEvaluation(),
      groupId: supportedGroups[0].id,
      recordedAt: earlierDate,
    };
    const evaluation2: RecordedEvaluation = {
      ...arbitraryRecordedEvaluation(),
      groupId: supportedGroups[0].id,
      recordedAt: laterDate,
    };

    let result: ReadonlyArray<DocmapIndexEntryModel>;

    beforeEach(() => {
      const ports = {
        getGroup: () => O.some(supportedGroups[0]),
        getEvaluationsByGroup: () => [evaluation1, evaluation2],
      };
      result = pipe(
        identifyAllPossibleIndexEntries(supportedGroupIds, ports),
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it('returns a list of all the evaluated index entry models', () => {
      expect(result).toStrictEqual([
        {
          articleId: evaluation2.articleId,
          groupId: evaluation2.groupId,
          updated: evaluation2.recordedAt,
          publisherAccountId: publisherAccountId(supportedGroups[0]),
        },
        {
          articleId: evaluation1.articleId,
          groupId: evaluation1.groupId,
          updated: evaluation1.recordedAt,
          publisherAccountId: publisherAccountId(supportedGroups[0]),
        },
      ]);
    });
  });

  describe('when a supported group has evaluated an article multiple times', () => {
    const earlierDate = new Date('1990');
    const middleDate = new Date('2012');
    const latestDate = new Date('2021');
    const articleId = arbitraryArticleId();
    const evaluation1: RecordedEvaluation = {
      ...arbitraryRecordedEvaluation(),
      groupId: supportedGroups[0].id,
      articleId,
      recordedAt: earlierDate,
    };
    const evaluation2: RecordedEvaluation = {
      ...arbitraryRecordedEvaluation(),
      groupId: supportedGroups[0].id,
      articleId,
      recordedAt: latestDate,
    };
    const evaluation3: RecordedEvaluation = {
      ...arbitraryRecordedEvaluation(),
      groupId: supportedGroups[0].id,
      articleId,
      recordedAt: middleDate,
    };
    let result: ReadonlyArray<DocmapIndexEntryModel>;

    beforeEach(async () => {
      await framework.commandHelpers.createGroup(supportedGroups[0]);
      await framework.commandHelpers.recordEvaluation(evaluation1);
      await framework.commandHelpers.recordEvaluation(evaluation2);
      await framework.commandHelpers.recordEvaluation(evaluation3);
      result = pipe(
        identifyAllPossibleIndexEntries(supportedGroupIds, framework.queries),
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it.failing('returns the latest updated date', () => {
      expect(result).toStrictEqual([
        expect.objectContaining({
          updated: latestDate,
        }),
      ]);
    });
  });

  describe('when there is an evaluated event by an unsupported group', () => {
    const group = arbitraryGroup();
    const evaluation = {
      ...arbitraryRecordedEvaluation(),
      groupId: group.id,
    };
    let result: ReadonlyArray<DocmapIndexEntryModel>;

    beforeEach(async () => {
      await framework.commandHelpers.createGroup(group);
      await framework.commandHelpers.recordEvaluation(evaluation);
      result = pipe(
        identifyAllPossibleIndexEntries(supportedGroupIds, framework.queries),
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
      await framework.commandHelpers.recordEvaluation(evaluation);
      result = pipe(
        identifyAllPossibleIndexEntries(supportedGroupIds, framework.queries),
      );
    });

    it('fails with an internal server error', () => {
      expect(result).toStrictEqual(E.left(expect.objectContaining({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      })));
    });
  });
});
