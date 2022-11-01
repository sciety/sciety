import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { handleEvent, initialState, ReadModel } from '../../../src/add-article-to-elife-subject-area-list/read-model';
import { ArticleIdsByState } from '../../../src/add-article-to-elife-subject-area-list/read-model-status';
import { articleAddedToList } from '../../../src/domain-events/article-added-to-list-event';
import { biorxivCategoryRecorded } from '../../../src/domain-events/biorxiv-category-recorded-event';
import { evaluationRecorded } from '../../../src/domain-events/evaluation-recorded-event';
import { arbitraryWord } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getArticleIdsByState = (readModel: ReadModel) => (): ArticleIdsByState => ({
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

    const readModel = pipe(
      [
        evaluationRecorded(arbitraryGroupId(), articleIdA, arbitraryReviewId()),
        articleAddedToList(articleIdB, arbitraryListId()),
        biorxivCategoryRecorded(articleIdC, arbitraryWord()),
        evaluationRecorded(arbitraryGroupId(), articleIdD, arbitraryReviewId()),
        biorxivCategoryRecorded(articleIdD, arbitraryWord()),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it.failing('groups articles by state', () => {
      expect(getArticleIdsByState(readModel)()).toStrictEqual({
        evaluated: [articleIdA],
        listed: [articleIdB],
        'category-known': [articleIdC],
        'evaluated-and-category-known': [articleIdD],
      });
    });
  });
});
