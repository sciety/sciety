import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../src/domain-events';
import { elifeGroupId } from '../../../src/read-models/elife-subject-area-lists/data';
import { getCorrespondingListId } from '../../../src/read-models/elife-subject-area-lists/get-corresponding-list-id';
import { getOneArticleReadyToBeListed } from '../../../src/read-models/elife-subject-area-lists/get-one-article-ready-to-be-listed';
import {
  handleEvent, initialState,
} from '../../../src/read-models/elife-subject-area-lists/handle-event';
import { ArticleId } from '../../../src/types/article-id';
import { arbitraryDate } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { arbitrarySubjectArea } from '../../types/subject-area.helper';

describe('get-one-article-ready-to-be-listed', () => {
  describe('given a bunch of events', () => {
    const articleIdA = arbitraryExpressionDoi();
    const knownSubjectAreaValue = 'neuroscience';
    const subjectArea = arbitrarySubjectArea(knownSubjectAreaValue);
    const listId = O.getOrElseW(shouldNotBeCalled)(getCorrespondingListId(subjectArea));

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
        constructEvent('SubjectAreaRecorded')({ articleId: new ArticleId(articleIdA), subjectArea }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns one article', () => {
      expect(getOneArticleReadyToBeListed(readModel)()).toStrictEqual(O.some({
        articleId: new ArticleId(articleIdA),
        listId,
      }));
    });
  });
});
