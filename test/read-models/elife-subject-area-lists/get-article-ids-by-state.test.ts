import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import {
  handleEvent, initialState,
} from '../../../src/read-models/elife-subject-area-lists/handle-event.js';
import { elifeGroupId, elifeSubjectAreaLists } from '../../../src/read-models/elife-subject-area-lists/data.js';
import { constructEvent } from '../../../src/domain-events/index.js';
import { arbitraryArticleId } from '../../types/article-id.helper.js';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper.js';
import { arbitrarySubjectArea } from '../../types/subject-area.helper.js';
import { arbitraryDate } from '../../helpers.js';
import { getArticleIdsByState } from '../../../src/read-models/elife-subject-area-lists/get-article-ids-by-state.js';

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
