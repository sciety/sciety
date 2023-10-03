import { toHtmlFragment } from '../../types/html-fragment';
import * as LID from '../../types/list-id';
import { Params } from './params';
import { ViewModel } from './view-model';

const listName = 'My test list';
const listId = LID.fromValidatedString('fake-list-id');

export const constructViewModel = (params: Params): ViewModel => ({
  articleId: params.articleId,
  articleTitle: toHtmlFragment('An article'),
  listId,
  listName,
});
