import * as TE from 'fp-ts/TaskEither';
import { evaluationRecorded, userSavedArticle } from '../../src/domain-events';
import { addArticleToElifeSubjectAreaLists } from '../../src/policies/add-article-to-elife-subject-area-lists';
import * as DE from '../../src/types/data-error';
import * as GID from '../../src/types/group-id';
import { dummyLogger } from '../dummy-logger';
import { arbitraryString } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('add-article-to-elife-subject-area-lists', () => {
  const defaultPorts = {
    logger: dummyLogger,
    getBiorxivOrMedrxivSubjectArea: () => TE.right(arbitraryString()),
    addArticleToList: () => TE.right(undefined),
  };

  describe('when an EvaluationRecorded event by eLife is received', () => {
    const elifeGroupId = GID.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0');

    describe('and the subject area belongs to the Medicine list', () => {
      const ports = {
        ...defaultPorts,
        getBiorxivOrMedrxivSubjectArea: () => TE.right('addiction medicine'),
        addArticleToList: jest.fn(() => TE.right(undefined)),
      };
      const event = evaluationRecorded(elifeGroupId, arbitraryArticleId(), arbitraryReviewId());

      beforeEach(async () => {
        await addArticleToElifeSubjectAreaLists(ports)(event)();
      });

      it('calls the AddArticleToList command', () => {
        expect(ports.addArticleToList).toHaveBeenCalledWith(expect.anything());
      });
    });

    describe('and the subject area belongs to the Cell Biology list', () => {
      const ports = {
        ...defaultPorts,
        getBiorxivOrMedrxivSubjectArea: () => TE.right('cell biology'),
        addArticleToList: jest.fn(() => TE.right(undefined)),
      };
      const event = evaluationRecorded(elifeGroupId, arbitraryArticleId(), arbitraryReviewId());

      beforeEach(async () => {
        await addArticleToElifeSubjectAreaLists(ports)(event)();
      });

      it('calls the AddArticleToList command', () => {
        expect(ports.addArticleToList).toHaveBeenCalledWith(expect.anything());
      });
    });

    describe('and the subject area does not belong to any supported eLife subject area list', () => {
      const ports = {
        ...defaultPorts,
        logger: jest.fn(dummyLogger),
        getBiorxivOrMedrxivSubjectArea: () => TE.right('not supported eLife subject area list'),
        addArticleToList: jest.fn(shouldNotBeCalled),
      };
      const event = evaluationRecorded(elifeGroupId, arbitraryArticleId(), arbitraryReviewId());

      beforeEach(async () => {
        await addArticleToElifeSubjectAreaLists(ports)(event)();
      });

      it('does not call the AddArticleToList command', () => {
        expect(ports.addArticleToList).not.toHaveBeenCalled();
      });

      it('logs', () => {
        expect(ports.logger).toHaveBeenCalledWith('info', expect.anything(), expect.anything());
      });
    });

    describe('and subject area cannot be retrieved', () => {
      const ports = {
        ...defaultPorts,
        logger: jest.fn(dummyLogger),
        getBiorxivOrMedrxivSubjectArea: () => TE.left(DE.unavailable),
        addArticleToList: jest.fn(shouldNotBeCalled),
      };
      const event = evaluationRecorded(elifeGroupId, arbitraryArticleId(), arbitraryReviewId());

      beforeEach(async () => {
        await addArticleToElifeSubjectAreaLists(ports)(event)();
      });

      it('does not call the AddArticleToList command', () => {
        expect(ports.addArticleToList).not.toHaveBeenCalled();
      });

      it('logs', () => {
        expect(ports.logger).toHaveBeenCalledWith('error', expect.anything(), expect.anything());
      });
    });
  });

  describe('when an EvaluationRecorded event by another group is received', () => {
    const anotherGroupId = arbitraryGroupId();
    const ports = {
      ...defaultPorts,
      addArticleToList: jest.fn(shouldNotBeCalled),
    };
    const event = evaluationRecorded(anotherGroupId, arbitraryArticleId(), arbitraryReviewId());

    beforeEach(async () => {
      await addArticleToElifeSubjectAreaLists(ports)(event)();
    });

    it('does not call the AddArticleToList command', () => {
      expect(ports.addArticleToList).not.toHaveBeenCalled();
    });
  });

  describe('when any other event is received', () => {
    const ports = {
      ...defaultPorts,
      addArticleToList: jest.fn(shouldNotBeCalled),
    };
    const event = userSavedArticle(arbitraryUserId(), arbitraryArticleId());

    beforeEach(async () => {
      await addArticleToElifeSubjectAreaLists(ports)(event)();
    });

    it('does not call the AddArticleToList command', () => {
      expect(ports.addArticleToList).not.toHaveBeenCalled();
    });
  });
});
