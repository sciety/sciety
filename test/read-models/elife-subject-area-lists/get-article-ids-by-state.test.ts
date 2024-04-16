import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../src/domain-events';
import { elifeGroupId, elifeSubjectAreaLists } from '../../../src/read-models/elife-subject-area-lists/data';
import { getArticleIdsByState } from '../../../src/read-models/elife-subject-area-lists/get-article-ids-by-state';
import {
  handleEvent, initialState,
} from '../../../src/read-models/elife-subject-area-lists/handle-event';
import { ArticleId } from '../../../src/types/article-id';
import { arbitraryDate } from '../../helpers';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { arbitrarySubjectArea } from '../../types/subject-area.helper';

describe('get-article-ids-by-state', () => {
  describe('given a bunch of events', () => {
    const articleIdA = arbitraryExpressionDoi();
    const articleIdB = arbitraryExpressionDoi();
    const articleIdC = arbitraryExpressionDoi();
    const articleIdD = arbitraryExpressionDoi();

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
        constructEvent('ArticleAddedToList')({ articleId: new ArticleId(articleIdB), listId: elifeSubjectAreaLists[0] }),
        constructEvent('SubjectAreaRecorded')({ articleId: new ArticleId(articleIdC), subjectArea: arbitrarySubjectArea() }),
        constructEvent('EvaluationPublicationRecorded')({
          groupId: elifeGroupId,
          articleId: articleIdD,
          evaluationLocator: arbitraryEvaluationLocator(),
          authors: [],
          publishedAt: arbitraryDate(),
          evaluationType: undefined,
        }),
        constructEvent('SubjectAreaRecorded')({ articleId: new ArticleId(articleIdD), subjectArea: arbitrarySubjectArea() }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('groups articles by state', () => {
      expect(getArticleIdsByState(readModel)()).toStrictEqual({
        evaluated: [articleIdA],
        listed: [articleIdB],
        'subject-area-known': [articleIdC],
        'evaluated-and-subject-area-known': [articleIdD],
      });
    });
  });
});
