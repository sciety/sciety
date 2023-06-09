import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { constructEvent } from '../../../../src/domain-events/domain-event';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { record } from '../../../../src/write-side/resources/curation-statement';

describe('record', () => {
  const evaluationLocator = arbitraryEvaluationLocator();
  const input = {
    groupId: arbitraryGroupId(),
    articleId: arbitraryArticleId(),
    evaluationLocator,
  };

  describe('when no curation statement with the given evaluation locator has been recorded', () => {
    const events = pipe(
      [],
      record(input),
    );

    it.failing('returns an CurationStatementRecorded event', () => {
      expect(events).toStrictEqual(E.right([expect.objectContaining({
        type: 'CurationStatementRecorded',
        groupId: input.groupId,
        articleId: input.articleId,
        evaluationLocator: input.evaluationLocator,
      })]));
    });
  });

  describe('when a curation statement with given evaluation locator has already been recorded', () => {
    const events = pipe(
      [
        constructEvent('CurationStatementRecorded')({
          groupId: arbitraryGroupId(),
          articleId: arbitraryArticleId(),
          evaluationLocator,
        }),
      ],
      record(input),
    );

    it.failing('returns no events', () => {
      expect(events).toStrictEqual(E.right([]));
    });
  });
});
