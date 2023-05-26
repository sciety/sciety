import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import {
  elifeGroupId, getCorrespondingListId, handleEvent, initialState,
} from '../../../src/add-article-to-elife-subject-area-list/read-model';
import { getOneArticleReadyToBeListed } from '../../../src/add-article-to-elife-subject-area-list/read-model/get-one-article-ready-to-be-listed';
import { subjectAreaRecorded, constructEvent } from '../../../src/domain-events';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { arbitrarySubjectArea } from '../../types/subject-area.helper';
import { arbitraryDate } from '../../helpers';

describe('get-one-article-ready-to-be-listed', () => {
  describe('given a bunch of events', () => {
    const articleIdA = arbitraryArticleId();
    const knownSubjectAreaValue = 'neuroscience';
    const subjectArea = arbitrarySubjectArea(knownSubjectAreaValue);
    const listId = O.getOrElseW(shouldNotBeCalled)(getCorrespondingListId(subjectArea));

    const readModel = pipe(
      [
        constructEvent('EvaluationRecorded')({
          groupId: elifeGroupId,
          articleId: articleIdA,
          evaluationLocator: arbitraryEvaluationLocator(),
          authors: [],
          publishedAt: arbitraryDate(),
        }),
        subjectAreaRecorded(articleIdA, subjectArea),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns one article', () => {
      expect(getOneArticleReadyToBeListed(readModel)()).toStrictEqual(O.some({
        articleId: articleIdA,
        listId,
      }));
    });
  });
});
