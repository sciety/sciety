import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { erase, update, record } from '../../../../src/write-side/resources/evaluation';
import { arbitraryEvaluationType } from '../../../types/evaluation-type.helper';
import { arbitraryDate } from '../../../helpers';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { arbitraryGroupId } from '../../../types/group-id.helper';

describe('lifecycle', () => {
  describe('record -> erase -> update', () => {
    const recordCommand = {
      groupId: arbitraryGroupId(),
      publishedAt: arbitraryDate(),
      evaluationLocator: arbitraryEvaluationLocator(),
      articleId: arbitraryArticleId(),
      authors: [],
    };

    const result = pipe(
      [],
      E.right,
      E.chain((events) => pipe(
        events,
        record(recordCommand),
        E.map((outputEvents) => [...events, ...outputEvents]),
      )),
      E.chain((events) => pipe(
        events,
        erase({ evaluationLocator: recordCommand.evaluationLocator }),
        E.map((outputEvents) => [...events, ...outputEvents]),
      )),
      E.chain((events) => pipe(
        events,
        update({ evaluationLocator: recordCommand.evaluationLocator, evaluationType: arbitraryEvaluationType() }),
        E.map((outputEvents) => [...events, ...outputEvents]),
      )),
    );

    it('errors with not found', () => {
      expect(result).toStrictEqual(E.left('Evaluation to be updated does not exist'));
    });
  });
});
