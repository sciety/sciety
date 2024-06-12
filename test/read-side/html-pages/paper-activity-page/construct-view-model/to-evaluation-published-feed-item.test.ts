import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { toEvaluationPublishedFeedItem } from '../../../../../src/read-side/html-pages/paper-activity-page/construct-view-model/to-evaluation-published-feed-item';
import { EvaluationPublishedFeedItem } from '../../../../../src/read-side/html-pages/paper-activity-page/view-model';
import { TestFramework, createTestFramework } from '../../../../framework';
import { arbitrarySanitisedHtmlFragment, arbitraryUrl } from '../../../../helpers';
import { arbitraryDataError } from '../../../../types/data-error.helper';
import { arbitraryRecordedEvaluation } from '../../../../types/recorded-evaluation.helper';

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
    it.todo('links to the group home page');

    it.todo('displays the group name');

    it.todo('displays the group avatar');
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
