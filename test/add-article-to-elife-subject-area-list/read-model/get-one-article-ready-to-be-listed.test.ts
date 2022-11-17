import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import {
  elifeGroupId, handleEvent, initialState, ReadModel,
} from '../../../src/add-article-to-elife-subject-area-list/read-model';
import { ArticleStateWithSubjectArea } from '../../../src/add-article-to-elife-subject-area-list/read-model/handle-event';
import { evaluationRecorded } from '../../../src/domain-events/evaluation-recorded-event';
import { subjectAreaRecorded } from '../../../src/domain-events/subject-area-recorded-event';
import { fromString as doiFromString } from '../../../src/types/doi';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';
import { arbitrarySubjectArea } from '../../types/subject-area.helper';

const getOneArticleReadyToBeListed = (readModel: ReadModel) => () => pipe(
  readModel,
  R.filter((state): state is ArticleStateWithSubjectArea => state.name === 'evaluated-and-subject-area-known'),
  R.toEntries,
  RA.head,
  O.chain(([articleIdAsString, state]) => pipe(
    doiFromString(articleIdAsString),
    O.map((articleId) => ({
      articleId,
      subjectArea: state.subjectArea,
    })),
  )),
);

describe('get-one-article-ready-to-be-listed', () => {
  describe('given a bunch of events', () => {
    const articleIdA = arbitraryArticleId();
    const subjectArea = arbitrarySubjectArea();

    const readModel = pipe(
      [
        evaluationRecorded(elifeGroupId, articleIdA, arbitraryReviewId()),
        subjectAreaRecorded(articleIdA, subjectArea),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns one article', () => {
      expect(getOneArticleReadyToBeListed(readModel)()).toStrictEqual(O.some({
        articleId: articleIdA,
        subjectArea,
      }));
    });
  });
});
