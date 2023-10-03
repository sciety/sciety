import { toHtmlFragment } from '../../types/html-fragment';
import * as LID from '../../types/list-id';
import { Dependencies } from './dependencies';
import { Params } from './params';
import { ViewModel } from './view-model';

const listName = 'My test list';
const listId = LID.fromValidatedString('fake-list-id');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const constructViewModel = (dependencies: Dependencies) => (params: Params): ViewModel => ({
  articleId: params.articleId,
  articleTitle: toHtmlFragment('An article'),
  listId,
  listName,
});
