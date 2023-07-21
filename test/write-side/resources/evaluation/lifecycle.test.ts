import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { erase, update, record } from '../../../../src/write-side/resources/evaluation';
import { arbitraryEvaluationType } from '../../../types/evaluation-type.helper';
import { arbitraryDate } from '../../../helpers';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import { DomainEvent } from '../../../../src/domain-events';
import { ResourceAction } from '../../../../src/write-side/resources/resource-action';

const enact = <A>(a: ReturnType<ResourceAction<A>>) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  a,
  E.map((outputEvents) => [...events, ...outputEvents]),
);

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
      E.chain(enact(record(recordCommand))),
      E.chain(enact(erase({ evaluationLocator: recordCommand.evaluationLocator }))),
      E.chain(enact(update({
        evaluationLocator: recordCommand.evaluationLocator,
        evaluationType: arbitraryEvaluationType(),
      }))),
    );

    it('errors with not found', () => {
      expect(result).toStrictEqual(E.left('Evaluation to be updated does not exist'));
    });
  });
});
