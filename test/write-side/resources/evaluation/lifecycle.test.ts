import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { erase, update, record } from '../../../../src/write-side/resources/evaluation';
import { arbitraryEvaluationType } from '../../../types/evaluation-type.helper';
import { DomainEvent } from '../../../../src/domain-events';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryDate } from '../../../helpers';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { arbitraryGroupId } from '../../../types/group-id.helper';

describe('lifecycle', () => {
  describe('record -> erase -> update', () => {
    let result: unknown;
    const recordCommand = {
      groupId: arbitraryGroupId(),
      publishedAt: arbitraryDate(),
      evaluationLocator: arbitraryEvaluationLocator(),
      articleId: arbitraryArticleId(),
      authors: [],
    };

    beforeEach(() => {
      const events: Array<DomainEvent> = [];
      const eventsFromRecord = pipe(
        events,
        record(recordCommand),
        E.getOrElseW(shouldNotBeCalled),
      );
      events.push(...eventsFromRecord);
      const eventsFromErase = pipe(
        events,
        erase({
          evaluationLocator: recordCommand.evaluationLocator,
        }),
        E.getOrElseW(shouldNotBeCalled),
      );
      events.push(...eventsFromErase);
      result = update({
        evaluationLocator: recordCommand.evaluationLocator,
        evaluationType: arbitraryEvaluationType(),
      })(events);
    });

    it('errors with not found', () => {
      expect(result).toStrictEqual(E.left('Evaluation to be updated does not exist'));
    });
  });
});
