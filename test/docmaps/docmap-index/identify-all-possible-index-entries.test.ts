import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import {
  identifyAllPossibleIndexEntries,
  Ports,
} from '../../../src/docmaps/docmap-index/identify-all-possible-index-entries';
import { publisherAccountId } from '../../../src/docmaps/docmap/publisher-account-id';
import { evaluationRecorded } from '../../../src/domain-events';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('identify-all-possible-index-entries', () => {
  const supportedGroups = [arbitraryGroup(), arbitraryGroup()];
  const supportedGroupIds = supportedGroups.map((group) => group.id);
  const defaultPorts: Ports = {
    getGroup: (groupId) => O.some({
      ...arbitraryGroup(),
      id: groupId,
    }),
  };

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

  describe('when there are evaluated events by both supported and unsupported groups', () => {
    const events = [
      evaluationRecorded(arbitraryGroupId(), arbitraryArticleId(), arbitraryReviewId()),
    ];
    const result = pipe(
      events,
      identifyAllPossibleIndexEntries(supportedGroupIds, defaultPorts),
    );

    it('excludes articles evaluated by the unsupported group', () => {
      expect(result).toStrictEqual(E.right([]));
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
