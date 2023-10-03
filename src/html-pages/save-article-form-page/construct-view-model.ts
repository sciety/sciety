import * as TE from 'fp-ts/TaskEither';
import { toHtmlFragment } from '../../types/html-fragment';
import * as LID from '../../types/list-id';
import { Dependencies } from './dependencies';
import { Params } from './params';
import { ViewModel } from './view-model';
import * as DE from '../../types/data-error';

const listName = 'My test list';
const listId = LID.fromValidatedString('fake-list-id');

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const constructViewModel: ConstructViewModel = (dependencies) => (params) => TE.right({
  articleId: params.articleId,
  articleTitle: toHtmlFragment('An article'),
  listId,
  listName,
});
