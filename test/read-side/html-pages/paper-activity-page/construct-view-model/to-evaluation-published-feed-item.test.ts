import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { toEvaluationPublishedFeedItem } from '../../../../../src/read-side/html-pages/paper-activity-page/construct-view-model/to-evaluation-published-feed-item';
import { EvaluationPublishedFeedItem, GroupDetails } from '../../../../../src/read-side/html-pages/paper-activity-page/view-model';
import { constructGroupPagePath } from '../../../../../src/read-side/paths/construct-group-page-path';
import { RecordEvaluationPublicationCommand } from '../../../../../src/write-side/commands/record-evaluation-publication';
import { TestFramework, createTestFramework } from '../../../../framework';
import { arbitrarySanitisedHtmlFragment, arbitraryUrl } from '../../../../helpers';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { arbitraryDataError } from '../../../../types/data-error.helper';
import { arbitraryRecordedEvaluation } from '../../../../types/recorded-evaluation.helper';
import { arbitraryAddGroupCommand } from '../../../../write-side/commands/add-group-command.helper';
import { arbitraryRecordEvaluationPublicationCommand } from '../../../../write-side/commands/record-evaluation-publication-command.helper';

describe('to-evaluation-published-feed-item', () => {
  let framework: TestFramework;
  let sourceHref: EvaluationPublishedFeedItem['sourceHref'];
  let fullText: EvaluationPublishedFeedItem['digest'];

  beforeEach(async () => {
    framework = createTestFramework();
  });

  describe('when the human readable original URL is available for the evaluation', () => {
    const humanReadableOriginalUrl = arbitraryUrl();

    beforeEach(async () => {
      sourceHref = await pipe(
        arbitraryRecordedEvaluation(),
        toEvaluationPublishedFeedItem({
          ...framework.dependenciesForViews,
          fetchEvaluationHumanReadableOriginalUrl: () => TE.right(humanReadableOriginalUrl),
        }),
        T.map((feedItem) => feedItem.sourceHref),
      )();
    });

    it('displays it as a link', () => {
      expect(sourceHref).toStrictEqual(O.some(humanReadableOriginalUrl));
    });
  });

  describe('when the human readable original URL is not available for the evaluation', () => {
    beforeEach(async () => {
      sourceHref = await pipe(
        arbitraryRecordedEvaluation(),
        toEvaluationPublishedFeedItem({
          ...framework.dependenciesForViews,
          fetchEvaluationHumanReadableOriginalUrl: () => TE.left(arbitraryDataError()),
        }),
        T.map((feedItem) => feedItem.sourceHref),
      )();
    });

    it('hides the link', () => {
      expect(sourceHref).toStrictEqual(O.none);
    });
  });

  describe('when the evaluation digest is available', () => {
    const digest = arbitrarySanitisedHtmlFragment();

    beforeEach(async () => {
      fullText = await pipe(
        arbitraryRecordedEvaluation(),
        toEvaluationPublishedFeedItem({
          ...framework.dependenciesForViews,
          fetchEvaluationDigest: () => TE.right(digest),
        }),
        T.map((feedItem) => feedItem.digest),
      )();
    });

    it('displays the digest', () => {
      expect(fullText).toStrictEqual(O.some(digest));
    });
  });

  describe('when the evaluation digest is not available', () => {
    beforeEach(async () => {
      fullText = await pipe(
        arbitraryRecordedEvaluation(),
        toEvaluationPublishedFeedItem({
          ...framework.dependenciesForViews,
          fetchEvaluationDigest: () => TE.left(arbitraryDataError()),
        }),
        T.map((feedItem) => feedItem.digest),
      )();
    });

    it('hides the digest', () => {
      expect(fullText).toStrictEqual(O.none);
    });
  });

  describe('when the group that has published the evaluation has joined Sciety', () => {
    const addGroupCommand = arbitraryAddGroupCommand();
    const recordEvaluationPublicationCommand: RecordEvaluationPublicationCommand = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      groupId: addGroupCommand.groupId,
    };
    let result: GroupDetails;

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
      await framework.commandHelpers.recordEvaluationPublication(recordEvaluationPublicationCommand);
      const recordedEvaluation = framework.queries.getEvaluationsOfMultipleExpressions([
        recordEvaluationPublicationCommand.expressionDoi,
      ])[0];
      result = await pipe(
        recordedEvaluation,
        toEvaluationPublishedFeedItem(framework.dependenciesForViews),
        T.map((feedItem) => feedItem.groupDetails),
        T.map(O.getOrElseW(shouldNotBeCalled)),
      )();
    });

    it('links to the group home page', () => {
      expect(result.groupHref).toStrictEqual(constructGroupPagePath.home.href(addGroupCommand));
    });

    it('displays the group name', () => {
      expect(result.groupName).toStrictEqual(addGroupCommand.name);
    });

    it('displays the group avatar', () => {
      expect(result.groupAvatarSrc).toStrictEqual(addGroupCommand.avatarPath);
    });
  });

  describe('when the group that has published the evaluation has not joined Sciety', () => {
    let result: EvaluationPublishedFeedItem['groupDetails'];

    beforeEach(async () => {
      result = await pipe(
        arbitraryRecordedEvaluation(),
        toEvaluationPublishedFeedItem(framework.dependenciesForViews),
        T.map((feedItem) => feedItem.groupDetails),
      )();
    });

    it('does not display any group details', () => {
      expect(result).toStrictEqual(O.none);
    });
  });
});
