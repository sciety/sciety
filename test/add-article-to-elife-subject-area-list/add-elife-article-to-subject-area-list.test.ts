import * as O from 'fp-ts/Option';
import { getCorrespondingListId } from '../../src/add-article-to-elife-subject-area-list/read-model';
import { AddArticleToList } from '../../src/shared-ports';
import { Doi } from '../../src/types/doi';
import { SubjectArea } from '../../src/types/subject-area';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitrarySubjectArea } from '../types/subject-area.helper';

type GetOneArticleInEvaluatedAndSubjectAreaKnownState = () => O.Option<{
  articleId: Doi,
  subjectArea: SubjectArea,
}>;

type Ports = {
  addArticleToList: AddArticleToList,
  getOneArticleIdInEvaluatedAndSubjectAreaKnownState: GetOneArticleInEvaluatedAndSubjectAreaKnownState,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addELifeArticleToSubjectAreaList = async (adapters: Ports): Promise<void> => {
};

describe('add-elife-article-to-subject-area-list', () => {
  describe('when there is work to do', () => {
    const articleId = arbitraryArticleId();
    const knownSubjectAreaValue = 'neuroscience';
    const listId = getCorrespondingListId(knownSubjectAreaValue);
    const adapters = {
      addArticleToList: jest.fn(),
      getOneArticleIdInEvaluatedAndSubjectAreaKnownState: () => O.some({
        articleId,
        subjectArea: arbitrarySubjectArea(knownSubjectAreaValue),
      }),
    };

    beforeAll(async () => {
      await addELifeArticleToSubjectAreaList(adapters);
    });

    it.failing('invokes addArticleToList command', () => {
      expect(adapters.addArticleToList).toHaveBeenCalledWith({
        articleId,
        listId,
      });
    });
  });

  describe('when there is no work to do', () => {
    it.todo('does not invoke a command');
  });
});
