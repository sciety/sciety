import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { evaluationRecorded, listCreated, userSavedArticle } from '../../src/domain-events';
import { addArticleToElifeSubjectAreaLists } from '../../src/policies/add-article-to-elife-subject-area-lists';
import * as DE from '../../src/types/data-error';
import * as Gid from '../../src/types/group-id';
import * as Lid from '../../src/types/list-id';
import { dummyLogger } from '../dummy-logger';
import { arbitraryString } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

const getAllEvents = T.of([
  listCreated(Lid.fromValidatedString('c7237468-aac1-4132-9598-06e9ed68f31d'), arbitraryString(), arbitraryString(), arbitraryGroupId()),
  listCreated(Lid.fromValidatedString('cb15ef21-944d-44d6-b415-a3d8951e9e8b'), arbitraryString(), arbitraryString(), arbitraryGroupId()),
]);

describe('add-article-to-elife-subject-area-lists', () => {
  describe('when an EvaluationRecorded event by eLife is received', () => {
    const elifeGroupId = Gid.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0');

    describe('and the subject area belongs to the Medicine list', () => {
      const ports = {
        getAllEvents,
        commitEvents: jest.fn(() => T.of('no-events-created' as const)),
        logger: jest.fn(dummyLogger),
        getBiorxivOrMedrxivSubjectArea: () => TE.right('addiction medicine'),
        callAddArticleToList: jest.fn(() => TE.right(undefined)),
      };
      const event = evaluationRecorded(elifeGroupId, arbitraryArticleId(), arbitraryReviewId());

      beforeEach(async () => {
        await addArticleToElifeSubjectAreaLists(ports)(event)();
      });

      it('calls the AddArticleToList command', () => {
        expect(ports.callAddArticleToList).toHaveBeenCalledWith(expect.anything());
      });
    });

    describe('and the subject area belongs to the Cell Biology list', () => {
      const ports = {
        getAllEvents,
        commitEvents: jest.fn(() => T.of('no-events-created' as const)),
        logger: jest.fn(dummyLogger),
        getBiorxivOrMedrxivSubjectArea: () => TE.right('cell biology'),
        callAddArticleToList: jest.fn(() => TE.right(undefined)),
      };
      const event = evaluationRecorded(elifeGroupId, arbitraryArticleId(), arbitraryReviewId());

      beforeEach(async () => {
        await addArticleToElifeSubjectAreaLists(ports)(event)();
      });

      it('calls the AddArticleToList command', () => {
        expect(ports.callAddArticleToList).toHaveBeenCalledWith(expect.anything());
      });
    });

    describe('and the subject area does not belong to any supported eLife subject area list', () => {
      const ports = {
        getAllEvents,
        commitEvents: jest.fn(() => T.of('no-events-created' as const)),
        logger: jest.fn(dummyLogger),
        getBiorxivOrMedrxivSubjectArea: () => TE.right(arbitraryString()),
        callAddArticleToList: jest.fn(shouldNotBeCalled),
      };
      const event = evaluationRecorded(elifeGroupId, arbitraryArticleId(), arbitraryReviewId());

      beforeEach(async () => {
        await addArticleToElifeSubjectAreaLists(ports)(event)();
      });

      it('does not call the AddArticleToList command', () => {
        expect(ports.callAddArticleToList).not.toHaveBeenCalled();
      });

      it('logs', () => {
        expect(ports.logger).toHaveBeenCalledWith('info', expect.anything(), expect.anything());
      });
    });

    describe('and subject area cannot be retrieved', () => {
      const ports = {
        getAllEvents,
        commitEvents: jest.fn(() => T.of('no-events-created' as const)),
        logger: jest.fn(dummyLogger),
        getBiorxivOrMedrxivSubjectArea: () => TE.left(DE.unavailable),
        callAddArticleToList: jest.fn(shouldNotBeCalled),
      };
      const event = evaluationRecorded(elifeGroupId, arbitraryArticleId(), arbitraryReviewId());

      beforeEach(async () => {
        await addArticleToElifeSubjectAreaLists(ports)(event)();
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
      getBiorxivOrMedrxivSubjectArea: shouldNotBeCalled,
      callAddArticleToList: jest.fn(shouldNotBeCalled),
    };
    const event = evaluationRecorded(anotherGroupId, arbitraryArticleId(), arbitraryReviewId());

    beforeEach(async () => {
      await addArticleToElifeSubjectAreaLists(ports)(event)();
    });

    it('does not call the AddArticleToList command', () => {
      expect(ports.callAddArticleToList).not.toHaveBeenCalled();
    });
  });

  describe('when any other event is received', () => {
    const ports = {
      getAllEvents,
      commitEvents: jest.fn(() => T.of('no-events-created' as const)),
      logger: shouldNotBeCalled,
      getBiorxivOrMedrxivSubjectArea: shouldNotBeCalled,
      callAddArticleToList: jest.fn(shouldNotBeCalled),
    };
    const event = userSavedArticle(arbitraryUserId(), arbitraryArticleId());

    beforeEach(async () => {
      await addArticleToElifeSubjectAreaLists(ports)(event)();
    });

    it('does not call the AddArticleToList command', () => {
      expect(ports.callAddArticleToList).not.toHaveBeenCalled();
    });
  });
});
