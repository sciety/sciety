import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { handleEvent, initialState } from '../../../src/add-article-to-elife-subject-area-list/read-model';
import { articleAddedToList } from '../../../src/domain-events/article-added-to-list-event';
import { biorxivCategoryRecorded } from '../../../src/domain-events/biorxiv-category-recorded-event';
import { evaluationRecorded } from '../../../src/domain-events/evaluation-recorded-event';
import { arbitraryWord } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

const getArticleIdsByState = () => ({
  evaluated: [],
  listed: [],
  'category-known': [],
  'evaluated-and-category-known': [],
});

describe('get-article-ids-by-state', () => {
  describe('given a bunch of events', () => {
    const articleIdA = arbitraryArticleId();
    const articleIdB = arbitraryArticleId();
    const articleIdC = arbitraryArticleId();
    const articleIdD = arbitraryArticleId();

    const result = pipe(
      [
        evaluationRecorded(arbitraryGroupId(), articleIdA, arbitraryReviewId()),
        articleAddedToList(articleIdB, arbitraryListId()),
        biorxivCategoryRecorded(articleIdC, arbitraryWord()),
        evaluationRecorded(arbitraryGroupId(), articleIdD, arbitraryReviewId()),
        biorxivCategoryRecorded(articleIdD, arbitraryWord()),
      ],
      RA.reduce(initialState(), handleEvent),
      getArticleIdsByState,

    );

    it.failing('groups articles by state', () => {
      expect(result).toStrictEqual({
        evaluated: [articleIdA],
        listed: [articleIdB],
        'category-known': [articleIdC],
        'evaluated-and-category-known': [articleIdD],
      });
    });
  });
});
