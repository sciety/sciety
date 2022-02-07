import * as T from 'fp-ts/Task';
import { userSavedArticle } from '../../src/domain-events';
import { addArticleToElifeMedicineList } from '../../src/policies/add-article-to-elife-medicine-list';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('add-article-to-elife-medicine-list', () => {
  describe('when an EvaluationRecorded event by eLife is received', () => {
    describe('and the subject area belongs to the Medicine list', () => {
      it.todo('calls the AddArticleToList command');
    });

    describe('and the subject area does not belong to the Medicine list', () => {
      it.todo('does not call the AddArticleToList command');
    });

    describe('and subject area cannot be retrieved', () => {
      it.todo('does not call the AddArticleToList command');

      it.todo('logs an error');
    });
  });

  describe('when an EvaluationRecorded event by another group is received', () => {
    it.todo('does not call the AddArticleToList command');
  });

  describe('when any other event is received', () => {
    const ports = {
      getAllEvents: T.of([]),
      commitEvents: jest.fn(() => T.of('no-events-created' as const)),
      logger: shouldNotBeCalled,
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
