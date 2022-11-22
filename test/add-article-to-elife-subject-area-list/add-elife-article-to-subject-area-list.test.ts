import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { addArticleToElifeSubjectAreaList } from '../../src/add-article-to-elife-subject-area-list';
import { getCorrespondingListId } from '../../src/add-article-to-elife-subject-area-list/read-model';
import { dummyLogger } from '../dummy-logger';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitrarySubjectArea } from '../types/subject-area.helper';

describe('add-elife-article-to-subject-area-list', () => {
  describe('when there is work to do', () => {
    const articleId = arbitraryArticleId();
    const knownSubjectAreaValue = 'neuroscience';
    const listId = O.getOrElseW(shouldNotBeCalled)(getCorrespondingListId(knownSubjectAreaValue));
    const adapters = {
      addArticleToList: jest.fn(() => TE.right('events-created' as const)),
      getOneArticleReadyToBeListed: () => O.some({
        articleId,
        subjectArea: arbitrarySubjectArea(knownSubjectAreaValue),
      }),
      logger: dummyLogger,
    };

    beforeAll(async () => {
      await addArticleToElifeSubjectAreaList(adapters);
    });

    it('invokes addArticleToList command', () => {
      expect(adapters.addArticleToList).toHaveBeenCalledWith({
        articleId,
        listId,
      });
    });
  });

  describe('when there is no work to do', () => {
    const adapters = {
      addArticleToList: jest.fn(),
      getOneArticleReadyToBeListed: () => O.none,
      logger: dummyLogger,
    };

    beforeAll(async () => {
      await addArticleToElifeSubjectAreaList(adapters);
    });

    it('does not invoke a command', () => {
      expect(adapters.addArticleToList).not.toHaveBeenCalled();
    });
  });
});
