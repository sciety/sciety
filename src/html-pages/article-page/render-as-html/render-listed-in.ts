import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { templateListItems } from '../../../shared-components/list-items';
import { ListId } from '../../../types/list-id';
import { toHtmlFragment } from '../../../types/html-fragment';

type ViewModel = ReadonlyArray<{
  listId: ListId,
  listName: string,
}>;

const renderList = (listContent: string) => `
  <ul role="list">
    ${listContent}
  </ul> 
`;
export const renderListedIn = (viewModel: ViewModel) => toHtmlFragment(
  process.env.EXPERIMENT_ENABLED === 'true'
    ? pipe(
      viewModel,
      RA.map((item) => toHtmlFragment(`<a href="/lists/${item.listId}">${item.listName}</a>`)),
      templateListItems,
      (listContent) => `
      <div>
        <h2>Listed in</h2>        
        ${renderList(listContent)}        
      </div>
    `,
    )
    : '',
);
