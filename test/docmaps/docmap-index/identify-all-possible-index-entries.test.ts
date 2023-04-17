import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import {
  DocmapIndexEntryModel,
  identifyAllPossibleIndexEntries,
  Ports,
} from '../../../src/docmaps/docmap-index/identify-all-possible-index-entries';
import { publisherAccountId } from '../../../src/docmaps/docmap/publisher-account-id';
import { evaluationRecorded } from '../../../src/domain-events';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';
import { createTestFramework, TestFramework } from '../../framework';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryRecordedEvaluation } from '../../types/recorded-evaluation.helper';

describe('identify-all-possible-index-entries', () => {
  const supportedGroups = [arbitraryGroup(), arbitraryGroup()];
  const supportedGroupIds = supportedGroups.map((group) => group.id);
  const defaultPorts: Ports = {
    getGroup: (groupId) => O.some({
      ...arbitraryGroup(),
      id: groupId,
    }),
  };

  let framework: TestFramework;

  beforeEach(async () => {
    framework = createTestFramework();
  });

  describe('when there are evaluated events by a supported group', () => {
    const articleId1 = arbitraryArticleId();
    const articleId2 = arbitraryArticleId();
    const earlierDate = new Date('1990');
    const laterDate = new Date('2000');
    const events = [
      evaluationRecorded(supportedGroupIds[0], articleId1, arbitraryReviewId(), [], new Date(), earlierDate),
      evaluationRecorded(supportedGroupIds[0], articleId2, arbitraryReviewId(), [], new Date(), laterDate),
    ];
    const ports = {
      getGroup: () => O.some(supportedGroups[0]),
    };
    const result = pipe(
      events,
      identifyAllPossibleIndexEntries(supportedGroupIds, ports),
    );

    it('returns a list of all the evaluated index entry models', () => {
      expect(result).toStrictEqual(E.right([
        {
          articleId: articleId2,
          groupId: supportedGroupIds[0],
          updated: laterDate,
          publisherAccountId: publisherAccountId(supportedGroups[0]),
        },
        {
          articleId: articleId1,
          groupId: supportedGroupIds[0],
          updated: earlierDate,
          publisherAccountId: publisherAccountId(supportedGroups[0]),
        },
      ]));
    });
  });

  describe('when a supported group has evaluated an article multiple times', () => {
    const earlierDate = new Date('1990');
    const middleDate = new Date('2012');
    const latestDate = new Date('2021');
    const articleId = arbitraryArticleId();
    const events = [
      evaluationRecorded(supportedGroupIds[0], articleId, arbitraryReviewId(), [], new Date(), earlierDate),
      evaluationRecorded(supportedGroupIds[0], articleId, arbitraryReviewId(), [], new Date(), latestDate),
      evaluationRecorded(supportedGroupIds[0], articleId, arbitraryReviewId(), [], new Date(), middleDate),
    ];
    const result = pipe(
      events,
      identifyAllPossibleIndexEntries(supportedGroupIds, defaultPorts),
    );

    it('returns the latest updated date', () => {
      expect(result).toStrictEqual(E.right([
        expect.objectContaining({
          updated: latestDate,
        }),
      ]));
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
      framework = createTestFramework();
      await framework.commandHelpers.createGroup(group);
      await framework.commandHelpers.recordEvaluation(evaluation);
      result = await pipe(
        framework.getAllEvents,
        T.map(identifyAllPossibleIndexEntries(supportedGroupIds, framework.queries)),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('excludes articles evaluated by the unsupported group', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('when a supported group cannot be fetched', () => {
    const events = [
      evaluationRecorded(supportedGroupIds[0], arbitraryArticleId(), arbitraryReviewId()),
    ];
    const ports = {
      getGroup: () => O.none,
    };
    const result = pipe(
      events,
      identifyAllPossibleIndexEntries(supportedGroupIds, ports),
    );

    it('fails with an internal server error', () => {
      expect(result).toStrictEqual(E.left(expect.objectContaining({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      })));
    });
  });
});
