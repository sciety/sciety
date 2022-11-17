import * as O from 'fp-ts/Option';
import { AddArticleToList } from '../../src/shared-ports';
import { Doi } from '../../src/types/doi';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryListId } from '../types/list-id.helper';

type GetOneArticleInEvaluatedAndCategoryKnownState = () => O.Option<Doi>;

type Ports = {
  addArticleToList: AddArticleToList,
  getOneArticleIdInEvaluatedAndCategoryKnownState: GetOneArticleInEvaluatedAndCategoryKnownState,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addELifeArticleToSubjectAreaList = async (adapters: Ports): Promise<void> => {
};

describe('add-elife-article-to-subject-area-list', () => {
  describe('when there is work to do', () => {
    const articleId = arbitraryArticleId();
    const adapters = {
      addArticleToList: jest.fn(),
      getOneArticleIdInEvaluatedAndCategoryKnownState: () => O.some(articleId),
    };

    beforeAll(async () => {
      await addELifeArticleToSubjectAreaList(adapters);
    });

    it.failing('invokes addArticleToList command', () => {
      expect(adapters.addArticleToList).toHaveBeenCalledWith({
        articleId,
        listId: arbitraryListId(),
      });
    });
  });

  describe('when there is no work to do', () => {
    it.todo('does not invoke a command');
  });
});
