import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { toEvaluationPublishedFeedItem } from '../../../../../src/read-side/html-pages/paper-activity-page/construct-view-model/to-evaluation-published-feed-item';
import { EvaluationPublishedFeedItem } from '../../../../../src/read-side/html-pages/paper-activity-page/view-model';
import { TestFramework, createTestFramework } from '../../../../framework';
import { arbitraryUri } from '../../../../helpers';
import { arbitraryDataError } from '../../../../types/data-error.helper';
import { arbitraryRecordedEvaluation } from '../../../../types/recorded-evaluation.helper';

describe('to-evaluation-published-feed-item', () => {
  let framework: TestFramework;
  let sourceHref: EvaluationPublishedFeedItem['sourceHref'];

  beforeEach(async () => {
    framework = createTestFramework();
  });

  describe('when the human readable original URL is available for the evaluation', () => {
    const humanReadableOriginalUrl = new URL(arbitraryUri());

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

    it.skip('hides the link', () => {
      expect(sourceHref).toStrictEqual(O.none);
    });
  });

  describe('when the evaluation digest is available', () => {
    it.todo('displays the digest');
  });

  describe('when the evaluation digest is not available', () => {
    it.todo('hides the digest');
  });
});
