import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { articleAddedToList, listCreated } from '../../../src/domain-events';
import { evaluationRecorded } from '../../../src/domain-events/evaluation-recorded-event';
import { handleEvent, initialState } from '../../../src/shared-read-models/elife-articles-missing-from-subject-area-lists/handle-event';
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
        RA.reduce(initialState, handleEvent),
      );

      expect(readModel).toStrictEqual({ [articleId.value]: 'missing' });
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
        RA.reduce(initialState, handleEvent),
      );

      expect(readModel).toStrictEqual({
        [articleId.value]: 'missing',
        [articleId2.value]: 'missing',
      });
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
        RA.reduce(initialState, handleEvent),
      );

      expect(readModel).toStrictEqual({ [articleId.value]: 'missing' });
    });
  });

  describe('when there is an evaluation by eLife on an article that has been added to an eLife subject area list', () => {
    it.each([
      [LID.fromValidatedString('3792ee73-6a7d-4c54-b6ee-0abc18cb8bc4')],
      [LID.fromValidatedString('b2b55ddd-c0f2-4406-b304-b744af989e72')],
      [LID.fromValidatedString('977cec9b-7ff6-4cf5-a487-30f0cc544cdb')],
      [LID.fromValidatedString('cb15ef21-944d-44d6-b415-a3d8951e9e8b')],
      [LID.fromValidatedString('c9efbf2e-8d20-4a9a-b407-c25d185b4939')],
      [LID.fromValidatedString('1008fbbe-9d14-4737-808f-4170640df9cb')],
      [LID.fromValidatedString('a9f35fb7-c2fe-4fde-af39-f7c79ea0a497')],
      [LID.fromValidatedString('0453b3c1-d58e-429f-8c1e-588ccc646113')],
      [LID.fromValidatedString('5146099b-22e0-4589-9f16-10586e08ca4b')],
      [LID.fromValidatedString('890bf35a-c3da-413a-8cdb-864b7ce91a51')],
      [LID.fromValidatedString('b4acc6f3-bf15-4add-ab1f-bc72a8a3da7f')],
      [LID.fromValidatedString('c7237468-aac1-4132-9598-06e9ed68f31d')],
      [LID.fromValidatedString('db62bf5b-bcd4-42eb-bd99-e7a37283041d')],
      [LID.fromValidatedString('708b4836-0adf-4326-844f-fdf8ef816402')],
      [LID.fromValidatedString('3253c905-8083-4f3d-9e1f-0a8085e64ee5')],
      [LID.fromValidatedString('84577aec-a4ab-4c61-8c2e-b799a3918350')],
      [LID.fromValidatedString('57a4fa09-d9f5-466d-8038-ea9d29603aef')],
      [LID.fromValidatedString('205415a7-b409-4ded-ada2-3116c953c4c2')],
      [LID.fromValidatedString('d3d30687-62ee-4bb6-8723-f8d49dab7882')],
      [LID.fromValidatedString('a059f20a-366d-4790-b1f2-03bfb9b915b6')],
      [LID.fromValidatedString('c743bc3d-955a-4e97-b897-5e423ef0d3bc')],
      [LID.fromValidatedString('86a14824-8a48-4194-b75a-efbca28b90ae')],
    ])('does not include the article in the read model', (elifeListId) => {
      const articleId = arbitraryArticleId();
      const elifeGroupId = GroupId.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0');
      const readModel = pipe(
        [
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
          articleAddedToList(articleId, elifeListId),
        ],
        RA.reduce(initialState, handleEvent),
      );

      expect(readModel).toStrictEqual({});
    });
  });

  describe('when there is an evaluation by eLife on an article that has already been added to an eLife subject area list', () => {
    it.failing('does not include the article in the read model', () => {
      const articleId = arbitraryArticleId();
      const elifeListId = LID.fromValidatedString('a059f20a-366d-4790-b1f2-03bfb9b915b6');
      const elifeGroupId = GroupId.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0');
      const readModel = pipe(
        [
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
          articleAddedToList(articleId, elifeListId),
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
        ],
        RA.reduce(initialState, handleEvent),
      );

      expect(readModel).toStrictEqual({ [articleId.value]: 'added' });
    });
  });

  describe('when there is an evaluation by another group', () => {
    it('does not affect the read model', () => {
      const readModel = pipe(
        [
          evaluationRecorded(arbitraryGroupId(), arbitraryArticleId(), arbitraryReviewId()),
        ],
        RA.reduce(initialState, handleEvent),
      );

      expect(readModel).toStrictEqual({});
    });
  });

  describe('when the event is not relevant', () => {
    it('does not affect the readmodel', () => {
      const readModel = pipe(
        [
          listCreated(arbitraryListId(), arbitraryString(), arbitraryString(), arbitraryListOwnerId()),
        ],
        RA.reduce(initialState, handleEvent),
      );

      expect(readModel).toStrictEqual({});
    });
  });
});
