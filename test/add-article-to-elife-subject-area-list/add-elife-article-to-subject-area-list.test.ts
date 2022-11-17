import { AddArticleToList } from '../../src/shared-ports';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryListId } from '../types/list-id.helper';

type Ports = {
  addArticleToList: AddArticleToList,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addELifeArticleToSubjectAreaList = async (adapters: Ports): Promise<void> => {
};

describe('add-elife-article-to-subject-area-list', () => {
  describe('when there is work to do', () => {
    const adapters = {
      addArticleToList: jest.fn(),
    };

    beforeAll(async () => {
      await addELifeArticleToSubjectAreaList(adapters);
    });

    it.failing('invokes addArticleToList command', () => {
      expect(adapters.addArticleToList).toHaveBeenCalledWith({
        articleId: arbitraryArticleId(),
        listId: arbitraryListId(),
      });
    });
  });

  describe('when there is no work to do', () => {
    it.todo('does not invoke a command');
  });
});
