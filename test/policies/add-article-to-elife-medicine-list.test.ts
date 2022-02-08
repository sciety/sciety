import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { evaluationRecorded, listCreated, userSavedArticle } from '../../src/domain-events';
import { addArticleToElifeMedicineList } from '../../src/policies/add-article-to-elife-medicine-list';
import * as DE from '../../src/types/data-error';
import * as Gid from '../../src/types/group-id';
import { dummyLogger } from '../dummy-logger';
import { arbitraryString } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

const getAllEvents = T.of([
  listCreated('c7237468-aac1-4132-9598-06e9ed68f31d', arbitraryString(), arbitraryString(), arbitraryGroupId()),
]);

describe('add-article-to-elife-medicine-list', () => {
  describe('when an EvaluationRecorded event by eLife is received', () => {
    const elifeGroupId = Gid.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0');

    describe('and the subject area belongs to the Medicine list', () => {
      const ports = {
        getAllEvents,
        commitEvents: jest.fn(() => T.of('no-events-created' as const)),
        logger: jest.fn(dummyLogger),
        fetchMedrvixSubjectArea: () => TE.right('addiction medicine'),
      };
      const event = evaluationRecorded(elifeGroupId, arbitraryDoi(), arbitraryReviewId());

      beforeEach(async () => {
        await addArticleToElifeMedicineList(ports)(event)();
      });

      it('calls the AddArticleToList command', () => {
        expect(ports.commitEvents).toHaveBeenCalledWith(expect.anything());
      });
    });

    describe('and the subject area does not belong to the Medicine list', () => {
      const ports = {
        getAllEvents,
        commitEvents: jest.fn(() => T.of('no-events-created' as const)),
        logger: jest.fn(dummyLogger),
        fetchMedrvixSubjectArea: () => TE.right('allergy and immunology'),
      };
      const event = evaluationRecorded(elifeGroupId, arbitraryDoi(), arbitraryReviewId());

      beforeEach(async () => {
        await addArticleToElifeMedicineList(ports)(event)();
      });

      it('does not call the AddArticleToList command', () => {
        expect(ports.commitEvents).not.toHaveBeenCalled();
      });

      it('logs', () => {
        expect(ports.logger).toHaveBeenCalledWith('error', expect.anything(), expect.anything());
      });
    });

    describe('and subject area cannot be retrieved', () => {
      const ports = {
        getAllEvents,
        commitEvents: jest.fn(() => T.of('no-events-created' as const)),
        logger: jest.fn(dummyLogger),
        fetchMedrvixSubjectArea: () => TE.left(DE.unavailable),
      };
      const event = evaluationRecorded(elifeGroupId, arbitraryDoi(), arbitraryReviewId());

      beforeEach(async () => {
        await addArticleToElifeMedicineList(ports)(event)();
      });

      it('does not call the AddArticleToList command', () => {
        expect(ports.commitEvents).not.toHaveBeenCalled();
      });

      it('logs', () => {
        expect(ports.logger).toHaveBeenCalledWith('error', expect.anything(), expect.anything());
      });
    });
  });

  describe('when an EvaluationRecorded event by another group is received', () => {
    const anotherGroupId = arbitraryGroupId();
    const ports = {
      getAllEvents,
      commitEvents: jest.fn(() => T.of('no-events-created' as const)),
      logger: shouldNotBeCalled,
      fetchMedrvixSubjectArea: shouldNotBeCalled,
    };
    const event = evaluationRecorded(anotherGroupId, arbitraryDoi(), arbitraryReviewId());

    beforeEach(async () => {
      await addArticleToElifeMedicineList(ports)(event)();
    });

    it('does not call the AddArticleToList command', () => {
      expect(ports.commitEvents).not.toHaveBeenCalled();
    });
  });

  describe('when any other event is received', () => {
    const ports = {
      getAllEvents,
      commitEvents: jest.fn(() => T.of('no-events-created' as const)),
      logger: shouldNotBeCalled,
      fetchMedrvixSubjectArea: shouldNotBeCalled,
    };
    const event = userSavedArticle(arbitraryUserId(), arbitraryDoi());

    beforeEach(async () => {
      await addArticleToElifeMedicineList(ports)(event)();
    });

    it('does not call the AddArticleToList command', () => {
      expect(ports.commitEvents).not.toHaveBeenCalled();
    });
  });
});
