import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import {
  elifeGroupId, getArticleIdsByState, handleEvent, initialState,
} from '../../../src/add-article-to-elife-subject-area-list/read-model';
import { elifeSubjectAreaLists } from '../../../src/add-article-to-elife-subject-area-list/read-model/data';
import { evaluationRecorded, subjectAreaRecorded, constructEvent } from '../../../src/domain-events';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { arbitrarySubjectArea } from '../../types/subject-area.helper';
import { arbitraryDate } from '../../helpers';

describe('get-article-ids-by-state', () => {
  describe('given a bunch of events', () => {
    const articleIdA = arbitraryArticleId();
    const articleIdB = arbitraryArticleId();
    const articleIdC = arbitraryArticleId();
    const articleIdD = arbitraryArticleId();

    const readModel = pipe(
      [
        evaluationRecorded(elifeGroupId, articleIdA, arbitraryEvaluationLocator(), [], arbitraryDate()),
        constructEvent('ArticleAddedToList')({ articleId: articleIdB, listId: elifeSubjectAreaLists[0] }),
        subjectAreaRecorded(articleIdC, arbitrarySubjectArea()),
        evaluationRecorded(elifeGroupId, articleIdD, arbitraryEvaluationLocator(), [], arbitraryDate()),
        subjectAreaRecorded(articleIdD, arbitrarySubjectArea()),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('groups articles by state', () => {
      expect(getArticleIdsByState(readModel)()).toStrictEqual({
        evaluated: [articleIdA.value],
        listed: [articleIdB.value],
        'subject-area-known': [articleIdC.value],
        'evaluated-and-subject-area-known': [articleIdD.value],
      });
    });
  });
});
