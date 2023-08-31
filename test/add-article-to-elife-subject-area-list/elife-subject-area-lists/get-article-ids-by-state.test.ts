import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import {
  handleEvent, initialState,
} from '../../../src/add-article-to-elife-subject-area-list/elife-subject-area-lists/handle-event';
import { elifeGroupId, elifeSubjectAreaLists } from '../../../src/add-article-to-elife-subject-area-list/elife-subject-area-lists/data';
import { constructEvent } from '../../../src/domain-events';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { arbitrarySubjectArea } from '../../types/subject-area.helper';
import { arbitraryDate } from '../../helpers';
import { getArticleIdsByState } from '../../../src/add-article-to-elife-subject-area-list/elife-subject-area-lists/get-article-ids-by-state';

describe('get-article-ids-by-state', () => {
  describe('given a bunch of events', () => {
    const articleIdA = arbitraryArticleId();
    const articleIdB = arbitraryArticleId();
    const articleIdC = arbitraryArticleId();
    const articleIdD = arbitraryArticleId();

    const readModel = pipe(
      [
        constructEvent('EvaluationPublicationRecorded')({
          groupId: elifeGroupId,
          articleId: articleIdA,
          evaluationLocator: arbitraryEvaluationLocator(),
          authors: [],
          publishedAt: arbitraryDate(),
          evaluationType: undefined,
        }),
        constructEvent('ArticleAddedToList')({ articleId: articleIdB, listId: elifeSubjectAreaLists[0] }),
        constructEvent('SubjectAreaRecorded')({ articleId: articleIdC, subjectArea: arbitrarySubjectArea() }),
        constructEvent('EvaluationPublicationRecorded')({
          groupId: elifeGroupId,
          articleId: articleIdD,
          evaluationLocator: arbitraryEvaluationLocator(),
          authors: [],
          publishedAt: arbitraryDate(),
          evaluationType: undefined,
        }),
        constructEvent('SubjectAreaRecorded')({ articleId: articleIdD, subjectArea: arbitrarySubjectArea() }),
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
