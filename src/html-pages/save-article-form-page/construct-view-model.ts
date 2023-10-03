import { Doi } from '../../types/doi';
import * as LID from '../../types/list-id';
import { ViewModel } from './view-model';

const listName = 'My test list';
const listId = LID.fromValidatedString('fake-list-id');

type Params = {
  articleId: Doi,
};

export const constructViewModel = (params: Params): ViewModel => ({
  articleId: params.articleId,
  listId,
  listName,
});
