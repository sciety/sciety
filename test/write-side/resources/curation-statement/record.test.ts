import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { constructEvent } from '../../../../src/domain-events';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { record } from '../../../../src/write-side/resources/curation-statement';
import { RecordCurationStatementCommand } from '../../../../src/write-side/commands/record-curation-statement';

describe('record', () => {
  const evaluationLocator = arbitraryEvaluationLocator();
  const input: RecordCurationStatementCommand = {
    groupId: arbitraryGroupId(),
    articleId: arbitraryArticleId(),
    evaluationLocator,
  };

  describe('when no curation statement with the given evaluation locator has already been recorded', () => {
    const eventsToBeRaised = pipe(
      [],
      record(input),
    );

    it('returns an CurationStatementRecorded event', () => {
      expect(eventsToBeRaised).toStrictEqual(E.right([expect.objectContaining({
        type: 'CurationStatementRecorded',
        groupId: input.groupId,
        articleId: input.articleId,
        evaluationLocator: input.evaluationLocator,
      })]));
    });
  });

  describe('when a curation statement with given evaluation locator has already been recorded', () => {
    const eventsToBeRaised = pipe(
      [
        constructEvent('CurationStatementRecorded')({
          groupId: arbitraryGroupId(),
          articleId: arbitraryArticleId(),
          evaluationLocator,
        }),
      ],
      record(input),
    );

    it('returns no events', () => {
      expect(eventsToBeRaised).toStrictEqual(E.right([]));
    });
  });
});
