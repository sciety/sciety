import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { evaluationRecorded } from '../../../src/domain-events/evaluation-recorded-event';
import { handleEvent } from '../../../src/shared-read-models/elife-articles-missing-from-subject-area-lists/handle-event';
import * as GroupId from '../../../src/types/group-id';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('handle-event', () => {
  describe('when there are currently no articles missing', () => {
    describe('and next there is an EvaluationRecorded by eLife event', () => {
      describe('and it has not been added to an eLife subject area list', () => {
        it('appears in the read model', () => {
          const articleId = arbitraryArticleId();
          const readModel = pipe(
            [
              evaluationRecorded(
                GroupId.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
                articleId,
                arbitraryReviewId(),
              ),
            ],
            RA.reduce({ articleIds: [] }, handleEvent),
          );

          expect(readModel.articleIds).toHaveLength(1);
          expect(readModel.articleIds[0].value).toStrictEqual(articleId.value);
        });
      });
    });
  });
});
