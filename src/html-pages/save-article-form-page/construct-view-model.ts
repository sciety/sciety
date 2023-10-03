import { Doi } from '../../types/doi';
import * as LID from '../../types/list-id';
import { ViewModel } from './view-model';

const doi = new Doi('10.1101/123456');
const listName = 'My test list';
const listId = LID.fromValidatedString('fake-list-id');

export const constructViewModel = (): ViewModel => ({
  articleId: doi,
  listId,
  listName,
});
