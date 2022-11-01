import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import {
  elifeGroupId, getArticleIdsByState, handleEvent, initialState,
} from '../../../src/add-article-to-elife-subject-area-list/read-model';
import { elifeSubjectAreaLists } from '../../../src/add-article-to-elife-subject-area-list/read-model/data';
import { articleAddedToList } from '../../../src/domain-events/article-added-to-list-event';
import { biorxivCategoryRecorded } from '../../../src/domain-events/biorxiv-category-recorded-event';
import { evaluationRecorded } from '../../../src/domain-events/evaluation-recorded-event';
import { arbitraryWord } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('get-article-ids-by-state', () => {
  describe('given a bunch of events', () => {
    const articleIdA = arbitraryArticleId();
    const articleIdB = arbitraryArticleId();
    const articleIdC = arbitraryArticleId();
    const articleIdD = arbitraryArticleId();

    const readModel = pipe(
      [
        evaluationRecorded(elifeGroupId, articleIdA, arbitraryReviewId()),
        articleAddedToList(articleIdB, elifeSubjectAreaLists[0]),
        biorxivCategoryRecorded(articleIdC, arbitraryWord()),
        evaluationRecorded(elifeGroupId, articleIdD, arbitraryReviewId()),
        biorxivCategoryRecorded(articleIdD, arbitraryWord()),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('groups articles by state', () => {
      expect(getArticleIdsByState(readModel)()).toStrictEqual({
        evaluated: [articleIdA.value],
        listed: [articleIdB.value],
        'category-known': [articleIdC.value],
        'evaluated-and-category-known': [articleIdD.value],
      });
    });
  });
});
