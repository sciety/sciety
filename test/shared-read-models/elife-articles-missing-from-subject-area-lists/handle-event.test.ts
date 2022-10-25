import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { articleAddedToList, listCreated } from '../../../src/domain-events';
import { evaluationRecorded } from '../../../src/domain-events/evaluation-recorded-event';
import { handleEvent } from '../../../src/shared-read-models/elife-articles-missing-from-subject-area-lists/handle-event';
import * as GroupId from '../../../src/types/group-id';
import * as LID from '../../../src/types/list-id';
import { arbitraryString } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../types/list-owner-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('handle-event', () => {
  describe('when there is an evaluation by eLife on an article that has not been added to an eLife subject area list', () => {
    it('includes the article in the read model', () => {
      const articleId = arbitraryArticleId();
      const elifeGroupId = GroupId.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0');
      const readModel = pipe(
        [
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
        ],
        RA.reduce([], handleEvent),
      );

      expect(readModel).toHaveLength(1);
      expect(readModel[0].value).toStrictEqual(articleId.value);
    });
  });

  describe('when there are multiple evaluations by eLife on articles that have not been added to an eLife subject area list', () => {
    it('includes the articles in the read model', () => {
      const articleId = arbitraryArticleId();
      const articleId2 = arbitraryArticleId();
      const elifeGroupId = GroupId.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0');
      const readModel = pipe(
        [
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
          evaluationRecorded(elifeGroupId, articleId2, arbitraryReviewId()),
        ],
        RA.reduce([], handleEvent),
      );

      expect(readModel).toHaveLength(2);
      expect(readModel[0].value).toStrictEqual(articleId.value);
      expect(readModel[1].value).toStrictEqual(articleId2.value);
    });
  });

  describe('when there are multiple evaluations by eLife on the same article that have not been added to an eLife subject area list', () => {
    it('includes the article once in the read model', () => {
      const articleId = arbitraryArticleId();
      const elifeGroupId = GroupId.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0');
      const readModel = pipe(
        [
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
        ],
        RA.reduce([], handleEvent),
      );

      expect(readModel).toHaveLength(1);
      expect(readModel[0].value).toStrictEqual(articleId.value);
    });
  });

  describe('when there is an evaluation by eLife on an article that has been added to an eLife subject area list', () => {
    it.failing('does not include the article in the read model', () => {
      const articleId = arbitraryArticleId();
      const elifeBiochemistryAndChemicalBiologyListId = LID.fromValidatedString('3792ee73-6a7d-4c54-b6ee-0abc18cb8bc4');
      const elifeGroupId = GroupId.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0');
      const readModel = pipe(
        [
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
          articleAddedToList(articleId, elifeBiochemistryAndChemicalBiologyListId),
        ],
        RA.reduce([], handleEvent),
      );

      expect(readModel).toHaveLength(0);
    });
  });

  describe('when there is an evaluation by another group', () => {
    it('does not affect the read model', () => {
      const readModel = pipe(
        [
          evaluationRecorded(arbitraryGroupId(), arbitraryArticleId(), arbitraryReviewId()),
        ],
        RA.reduce([], handleEvent),
      );

      expect(readModel).toHaveLength(0);
    });
  });

  describe('when the event is not relevant', () => {
    it('does not affect the readmodel', () => {
      const readModel = pipe(
        [
          listCreated(arbitraryListId(), arbitraryString(), arbitraryString(), arbitraryListOwnerId()),
        ],
        RA.reduce([], handleEvent),
      );

      expect(readModel).toHaveLength(0);
    });
  });
});
