import { pipe } from 'fp-ts/function';
import { evaluationRecorded } from '../../../src/domain-events';
import { executeCommand } from '../../../src/write-side/record-evaluation/execute-command';
import { arbitraryDate, arbitraryString } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';

describe('create-appropriate-events', () => {
  const evaluationLocator = arbitraryEvaluationLocator();
  const input = {
    groupId: arbitraryGroupId(),
    articleId: arbitraryArticleId(),
    evaluationLocator,
    publishedAt: arbitraryDate(),
    authors: [arbitraryString(), arbitraryString()],
  };

  describe('when the evaluation locator has NOT already been recorded', () => {
    const events = pipe(
      [],
      executeCommand(input),
    );

    it('returns an EvaluationRecorded event', () => {
      expect(events).toStrictEqual([expect.objectContaining({
        type: 'EvaluationRecorded',
        groupId: input.groupId,
        articleId: input.articleId,
        evaluationLocator: input.evaluationLocator,
        publishedAt: input.publishedAt,
        authors: input.authors,
      })]);
    });
  });

  describe('when the evaluation locator has already been recorded', () => {
    const events = pipe(
      [
        evaluationRecorded(arbitraryGroupId(), arbitraryArticleId(), evaluationLocator, [], arbitraryDate()),
      ],
      executeCommand(input),
    );

    it('returns no events', () => {
      expect(events).toStrictEqual([]);
    });
  });
});
