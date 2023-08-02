import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { record } from '../../../../src/write-side/resources/evaluation/record';
import { arbitraryDate, arbitraryString } from '../../../helpers';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { evaluationRecordedHelper } from '../../../domain-events/evaluation-recorded-event.helper';
import { RecordEvaluationCommand } from '../../../../src/write-side/commands';
import { arbitraryEvaluationType } from '../../../types/evaluation-type.helper';

describe('record', () => {
  const evaluationLocator = arbitraryEvaluationLocator();
  const input: RecordEvaluationCommand = {
    groupId: arbitraryGroupId(),
    articleId: arbitraryArticleId(),
    evaluationLocator,
    publishedAt: arbitraryDate(),
    authors: [arbitraryString(), arbitraryString()],
    evaluationType: arbitraryEvaluationType(),
  };

  describe('when the evaluation locator has already been recorded', () => {
    const events = pipe(
      [
        evaluationRecordedHelper(arbitraryGroupId(), arbitraryArticleId(), evaluationLocator, [], arbitraryDate()),
      ],
      record(input),
    );

    it('returns no events', () => {
      expect(events).toStrictEqual(E.right([]));
    });
  });
});
